'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { List } from '@phosphor-icons/react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem, type InspectorContent } from '@/context/DesignSystemContext';
import { AvatarDropdown, IconDropdown, InputDropdown } from '@/app/components/dropdown/Dropdown';

interface VariantPage {
  component: React.ReactNode;
  code: string;
  content: InspectorContent;
}

// One page per dropdown, so each shows only its own code and guidance.
const VARIANTS: Record<string, VariantPage> = {
  icon: {
    component: <IconDropdown />,
    code: `import { IconDropdown } from '@/app/components/dropdown/Dropdown';

<IconDropdown />`,
    content: {
      title: 'Icon menu',
      description: 'A small dark menu of actions that opens from an icon button.',
      guidance: {
        purpose:
          'Holds the few secondary actions that belong to one item, so they do not crowd the page. The icon button stays small until someone needs it.',
        behaviour:
          'Select the icon to open the menu below it; the icon turns to show it is open. Each row is one action with an icon and a label. Choosing a row, clicking outside or pressing the icon again closes it.',
        usage:
          'The more button on an app\'s page, with Visit website, View in App Store and Copy link. The same menu is used on mobile, anchored to the top right.',
      },
    },
  },
  role: {
    component: <InputDropdown />,
    code: `import { InputDropdown } from '@/app/components/dropdown/Dropdown';

<InputDropdown />`,
    content: {
      title: 'Role select',
      description: 'A form field that opens a list and takes one choice.',
      guidance: {
        purpose:
          'Lets someone pick one value from a short, fixed list inside a form. It looks like the text inputs around it, so a form reads as one set of fields.',
        behaviour:
          'Select the field to open the list directly beneath it. The chosen row is highlighted with a blue check, the list closes, and the field shows the choice. Until then it shows placeholder text.',
        usage:
          'The Role field in Account Settings (Student, Designer, Product Manager, Software Engineer, Others), and the same question during onboarding.',
      },
    },
  },
  avatar: {
    component: <AvatarDropdown />,
    code: `import { AvatarDropdown } from '@/app/components/dropdown/Dropdown';

<AvatarDropdown />`,
    content: {
      title: 'Avatar menu',
      description: 'The account menu that opens from the profile picture.',
      guidance: {
        purpose:
          'Gives one place for everything that is about the account or the product rather than the page: settings, pricing, what is new, and the way out.',
        behaviour:
          'Select the avatar to open a dark menu aligned to its right edge. The person\'s name and email sit at the top. Request an app and Settings come first, then a Theme switch, Pricing, Changelog (with a New tag when there is news), Upload content and Log out. Terms and Privacy sit at the bottom in smaller text. It closes on a choice or a click outside.',
        usage: 'The avatar at the right of the Tabs header on every signed-in page, on web and mobile.',
      },
    },
  },
};

export default function DropdownVariantPage() {
  const { variant } = useParams<{ variant: string }>();
  const page = VARIANTS[variant];

  const { setInspectorContent, setCustomControls, setCodeSnippet, setComponentTitle, setComponentCategory, setComponentIcon } =
    useDesignSystem();

  useEffect(() => {
    if (!page) return;
    setComponentTitle(page.content.title);
    setComponentIcon(<List size={14} />);
    setComponentCategory('Dropdown');
    setInspectorContent(page.content);
    setCustomControls(null);
    setCodeSnippet(page.code);
  }, [page, setInspectorContent, setCustomControls, setCodeSnippet, setComponentTitle, setComponentCategory, setComponentIcon]);

  if (!page) {
    return (
      <div className="flex flex-col gap-3 text-[15px] text-fg-muted">
        <p>There is no dropdown called &ldquo;{variant}&rdquo; in the system.</p>
        <Link href="/components/dropdown/icon" className="font-medium text-fg underline underline-offset-2">
          Go to Icon menu
        </Link>
      </div>
    );
  }

  return <PreviewCanvas>{page.component}</PreviewCanvas>;
}
