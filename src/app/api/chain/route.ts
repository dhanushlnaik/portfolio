import { NextResponse } from 'next/server';

// Latest Ethereum blocks for the harbour hero: one ship per block, one
// container per blob. Read from a public RPC on the server (so the browser
// never talks to the RPC directly) and cached briefly, since a new block only
// lands every ~12 seconds.

export const revalidate = 6;

const RPC_URL =
  process.env.ETH_RPC_URL || 'https://ethereum-rpc.publicnode.com';
const BLOCKS = 6;
const GAS_PER_BLOB = 131072;

export interface ChainBlock {
  number: number;
  timestamp: number;
  blobs: number;
  txs: number;
}

export interface ChainSnapshot {
  source: 'live' | 'sample';
  blobBaseFeeGwei: number | null;
  blocks: ChainBlock[]; // newest first
}

type RpcBlock = {
  number: string;
  timestamp: string;
  blobGasUsed?: string;
  transactions: unknown[];
};

async function rpc<T>(calls: { method: string; params: unknown[] }[]) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(
      calls.map((c, i) => ({ jsonrpc: '2.0', id: i, ...c })),
    ),
    next: { revalidate },
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) throw new Error(`RPC ${res.status}`);
  const out = (await res.json()) as { id: number; result?: T; error?: unknown }[];
  return out.sort((a, b) => a.id - b.id).map((r) => {
    if (r.error || r.result === undefined) throw new Error('RPC error');
    return r.result;
  });
}

const hex = (v?: string) => (v ? parseInt(v, 16) : 0);

function toBlock(b: RpcBlock): ChainBlock {
  return {
    number: hex(b.number),
    timestamp: hex(b.timestamp),
    blobs: Math.round(hex(b.blobGasUsed) / GAS_PER_BLOB),
    txs: b.transactions.length,
  };
}

/** Plausible fake data so the scene still works if the RPC is down. */
function sample(): ChainSnapshot {
  const now = Math.floor(Date.now() / 1000);
  const head = 26_400_000 + Math.floor((now - 1_794_500_000) / 12);
  return {
    source: 'sample',
    blobBaseFeeGwei: null,
    blocks: Array.from({ length: BLOCKS }, (_, i) => ({
      number: head - i,
      timestamp: now - i * 12,
      blobs: [6, 3, 9, 0, 5, 12][i % 6],
      txs: 150 + ((head - i) % 200),
    })),
  };
}

export async function GET() {
  try {
    const [latest, fee] = await rpc<RpcBlock | string>([
      { method: 'eth_getBlockByNumber', params: ['latest', false] },
      { method: 'eth_blobBaseFee', params: [] },
    ]);
    const head = toBlock(latest as RpcBlock);
    const older = await rpc<RpcBlock>(
      Array.from({ length: BLOCKS - 1 }, (_, i) => ({
        method: 'eth_getBlockByNumber',
        params: [`0x${(head.number - i - 1).toString(16)}`, false],
      })),
    );
    const snapshot: ChainSnapshot = {
      source: 'live',
      blobBaseFeeGwei: hex(fee as string) / 1e9,
      blocks: [head, ...older.map(toBlock)],
    };
    return NextResponse.json(snapshot, {
      headers: { 'Cache-Control': 's-maxage=6, stale-while-revalidate=30' },
    });
  } catch {
    return NextResponse.json(sample(), {
      headers: { 'Cache-Control': 's-maxage=30' },
    });
  }
}
