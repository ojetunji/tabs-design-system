'use client';

import { useState, useEffect } from 'react';
import PreviewCanvas from '@/components/shared/PreviewCanvas';
import { useDesignSystem } from '@/context/DesignSystemContext';
import { MultiSelect, MultiSelectOption } from '@/app/components/multi-select/MultiSelect';
import { CheckSquare } from '@phosphor-icons/react';

const OPTIONS: MultiSelectOption[] = [
  { id: '1', label: 'Launch screens' },
  { id: '2', label: 'Guided tours' },
  { id: '3', label: 'Account Set Up' },
  { id: '4', label: 'Log in' },
  { id: '5', label: 'Verification' },
  { id: '6', label: 'Search bar' },
];

const CODE = `import { useState } from 'react';
import { MultiSelect } from '@/app/components/multi-select/MultiSelect';

const options = [
  { id: '1', label: 'Launch screens' },
  { id: '2', label: 'Guided tours' },
  { id: '3', label: 'Account Set Up' },
];

export default function ScreensFilter() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <MultiSelect
      label="Screens"
      options={options}
      selectedIds={selected}
      onChange={setSelected}
    />
  );
}`;

/** The filter is its own playground: open it, search, pick. There is nothing left for a Customise card to set. */
export default function FilterPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { setInspectorContent, setCustomControls, setCodeSnippet, setComponentTitle, setComponentCategory, setComponentIcon } =
    useDesignSystem();

  useEffect(() => {
    setComponentTitle('Filter');
    setComponentIcon(<CheckSquare size={14} />);
    setComponentCategory('Dropdown');
    setInspectorContent({
      title: 'Filter',
      description: 'A menu for choosing several filters at once, with search. Open it and try it.',
      guidance: {
        purpose:
          'Narrows a long list by letting someone pick several values at once, without leaving the page they are filtering.',
        behaviour:
          'The button opens a dark menu with a search field at the top. Selecting a row turns it white with a check; rows stay where they are while the menu is open, and selected ones move to the top the next time it opens. When closed, the button turns blue, shows what is selected and has a control to clear it.',
        usage:
          "The Filter button on Explore (categories), the Screens filter on an app's page, and the same menu as a bottom sheet on mobile.",
      },
      propsList: [
        { prop: 'label', type: 'string', defaultVal: "'Screens'", description: 'Text on the button before anything is selected.' },
        { prop: 'options', type: '{ id: string; label: string }[]', defaultVal: '-', description: 'The values to choose from.' },
        { prop: 'selectedIds', type: 'string[]', defaultVal: '-', description: 'The ids currently selected.' },
        { prop: 'onChange', type: '(ids: string[]) => void', defaultVal: '-', description: 'Called with the new selection.' },
        { prop: 'placeholder', type: 'string', defaultVal: "'Search screens...'", description: 'Text in the search field.' },
        { prop: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Stops the menu from opening.' },
        { prop: 'isOpen', type: 'boolean', defaultVal: '-', description: 'Controls the menu from outside. Leave it out to let the button handle it.' },
        { prop: 'onOpenChange', type: '(open: boolean) => void', defaultVal: '-', description: 'Called when the menu opens or closes.' },
      ],
    });
    setCustomControls(null);
    setCodeSnippet(CODE);
  }, [setInspectorContent, setCustomControls, setCodeSnippet, setComponentTitle, setComponentCategory, setComponentIcon]);

  return (
    <PreviewCanvas>
      <MultiSelect label="Screens" options={OPTIONS} selectedIds={selectedIds} onChange={setSelectedIds} />
    </PreviewCanvas>
  );
}
