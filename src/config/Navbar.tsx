export interface NavItem {
  label: string;
  href: string;
}

export const navbarConfig = {
  logo: {
    src: '/assets/logo.png',
    alt: 'Dhanush Naik',
  },
  navItems: [
    { label: 'Projects', href: '/projects' },
    { label: 'Work', href: '/work-experience' },
    { label: 'Design', href: '/graphics-videos' },
    { label: 'Writing', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ] as NavItem[],
};
