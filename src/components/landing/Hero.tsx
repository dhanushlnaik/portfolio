import { heroConfig, skillComponents, socialLinks } from '@/config/Hero';
import { parseTemplate } from '@/lib/hero';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import React from 'react';

import Container from '../common/Container';
import LocalTime from '../common/LocalTime';
import { PixelBuddySprite } from '../common/PixelBuddy';
import Skill from '../common/Skill';
import CV from '../svgs/CV';
import Code from '../svgs/Code';
import { Button } from '../ui/button';

const buttonIcons = { CV, Code };

export default function Hero() {
  const { name, title, avatar, skills, description, buttons, status } =
    heroConfig;

  const renderDescription = () =>
    parseTemplate(description.template, skills).map((part) => {
      if (part.type === 'skill' && 'skill' in part && part.skill) {
        const SkillComponent =
          skillComponents[part.skill.component as keyof typeof skillComponents];
        return (
          <Skill key={part.key} name={part.skill.name} href={part.skill.href}>
            <SkillComponent />
          </Skill>
        );
      }
      if (part.type === 'bold' && 'text' in part) {
        return (
          <b key={part.key} className="font-semibold text-foreground">
            {part.text}
          </b>
        );
      }
      if (part.type === 'text' && 'text' in part) {
        return <span key={part.key}>{part.text}</span>;
      }
      return null;
    });

  return (
    <Container className="pt-6 md:pt-10">
      <div className="flex items-end justify-between gap-4">
        <div className="relative">
          <Image
            src={avatar}
            alt={name}
            width={192}
            height={192}
            priority
            className="size-20 rounded-2xl border bg-brand-soft md:size-24"
          />
          <PixelBuddySprite
            scale={2}
            className="absolute -right-5 -bottom-2 drop-shadow-sm"
          />
        </div>
        <LocalTime />
      </div>

      <Link
        href={status.href}
        className="group mt-8 inline-flex max-w-full items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
      >
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-brand" />
        </span>
        <span className="truncate">{status.text}</span>
        <ArrowUpRight className="size-3 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance md:text-5xl">
        {name}
      </h1>
      <p className="mt-2 font-mono text-sm text-muted-foreground md:text-base">
        {title}
      </p>

      <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg md:leading-9">
        {renderDescription()}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {buttons.map((button) => {
          const Icon = buttonIcons[button.icon as keyof typeof buttonIcons];
          return (
            <Button
              key={button.text}
              asChild
              variant={button.variant as 'outline' | 'default'}
              className={
                button.variant === 'default'
                  ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                  : undefined
              }
            >
              <Link href={button.href}>
                {Icon && <Icon className="size-4" />}
                {button.text}
              </Link>
            </Button>
          );
        })}
        <div className="flex items-center gap-1 sm:ml-2">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target="_blank"
              aria-label={link.name}
              title={link.name}
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <span className="size-5">{link.icon}</span>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
