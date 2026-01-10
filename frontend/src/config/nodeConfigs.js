import { Position } from 'reactflow';

export const nodeConfigs = {
  // Existing nodes
  customInput: {
    title: 'Input Node',
    accentColor: 'blue',
    icon: 'ArrowDownToLine',
    handles: [
      {
        id: 'value',
        type: 'source',
        position: Position.Right,
      }
    ],
    inputFields: [
      {
        key: 'inputName',
        type: 'text',
        label: 'Field Name',
        defaultValue: (id) => id.replace('customInput-', 'input_'),
        placeholder: 'Enter name...',
      },
      {
        key: 'inputType',
        type: 'select',
        label: 'Input Type',
        defaultValue: 'Text',
        options: ['Text', 'File'],
      }
    ]
  },

  llm: {
    title: 'LLM Engine',
    accentColor: 'purple',
    icon: 'Brain',
    description: 'Processes natural language inputs',
    handles: [
      {
        id: 'system',
        type: 'target',
        position: Position.Left,
        style: { top: '30%' }
      },
      {
        id: 'prompt',
        type: 'target',
        position: Position.Left,
        style: { top: '70%' }
      },
      {
        id: 'response',
        type: 'source',
        position: Position.Right,
      }
    ],
    inputFields: [
      {
        key: 'model',
        type: 'select',
        label: 'Model',
        defaultValue: 'gpt-4-turbo',
        options: [
          { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
          { value: 'gpt-4', label: 'GPT-4' },
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
          { value: 'claude-3-opus', label: 'Claude 3 Opus' },
          { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
          { value: 'claude-3-haiku', label: 'Claude 3 Haiku' }
        ]
      }
    ]
  },

  customOutput: {
    title: 'Output Node',
    accentColor: 'pink',
    icon: 'ArrowUpFromLine',
    handles: [
      {
        id: 'value',
        type: 'target',
        position: Position.Left,
      }
    ],
    inputFields: [
      {
        key: 'outputName',
        type: 'text',
        label: 'Field Name',
        defaultValue: (id) => id.replace('customOutput-', 'output_'),
        placeholder: 'Enter name...',
      },
      {
        key: 'outputType',
        type: 'select',
        label: 'Output Type',
        defaultValue: 'Text',
        options: ['Text', 'Image'],
      }
    ]
  },

  text: {
    title: 'Text Node',
    accentColor: 'green',
    icon: 'FileText',
    handles: [
      {
        id: 'output',
        type: 'source',
        position: Position.Right,
      }
    ],
    inputFields: [
      {
        key: 'text',
        type: 'textarea',
        label: 'Input Text',
        defaultValue: '{{input}}',
        placeholder: 'Type something here... Use {{variable}} for dynamic handles.',
        dynamicSize: true,
        minHeight: 60,
        maxHeight: 300,
        minWidth: 220,
        maxWidth: 400,
      },
    ]
  },

  // New node types
  filter: {
    title: 'Filter Node',
    accentColor: 'blue',
    icon: 'Filter',
    description: 'Filter data based on conditions',
    handles: [
      {
        id: 'input1',
        type: 'target',
        position: Position.Left,
        style: { top: '25%' }
      },
      {
        id: 'input2',
        type: 'target',
        position: Position.Left,
        style: { top: '50%' }
      },
      {
        id: 'input3',
        type: 'target',
        position: Position.Left,
        style: { top: '75%' }
      },
      {
        id: 'output',
        type: 'source',
        position: Position.Right,
      }
    ],
    inputFields: [
      {
        key: 'filterType',
        type: 'select',
        label: 'Filter Type',
        defaultValue: 'equals',
        options: ['equals', 'contains', 'greater_than', 'less_than'],
      }
    ]
  },

  transform: {
    title: 'Transform Node',
    accentColor: 'purple',
    icon: 'RefreshCw',
    description: 'Transform text data',
    handles: [
      {
        id: 'input',
        type: 'target',
        position: Position.Left,
      },
      {
        id: 'output',
        type: 'source',
        position: Position.Right,
      }
    ],
    inputFields: [
      {
        key: 'operation',
        type: 'select',
        label: 'Operation',
        defaultValue: 'upper',
        options: [
          { value: 'upper', label: 'Uppercase' },
          { value: 'lower', label: 'Lowercase' },
          { value: 'trim', label: 'Trim' },
          { value: 'reverse', label: 'Reverse' }
        ],
      }
    ]
  },

  apiRequest: {
    title: 'API Request',
    accentColor: 'pink',
    icon: 'Globe',
    description: 'Make HTTP requests',
    handles: [
      {
        id: 'input',
        type: 'target',
        position: Position.Left,
      },
      {
        id: 'output',
        type: 'source',
        position: Position.Right,
      }
    ],
    inputFields: [
      {
        key: 'url',
        type: 'text',
        label: 'URL',
        defaultValue: 'https://api.example.com',
        placeholder: 'Enter API endpoint...',
        required: true,
      },
      {
        key: 'method',
        type: 'select',
        label: 'Method',
        defaultValue: 'GET',
        options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      }
    ]
  },

  databaseQuery: {
    title: 'Database Query',
    accentColor: 'green',
    icon: 'Database',
    description: 'Execute SQL queries',
    handles: [
      {
        id: 'input',
        type: 'target',
        position: Position.Left,
      },
      {
        id: 'output',
        type: 'source',
        position: Position.Right,
      }
    ],
    inputFields: [
      {
        key: 'query',
        type: 'textarea',
        label: 'SQL Query',
        defaultValue: 'SELECT * FROM table',
        placeholder: 'Enter SQL query...',
        required: true,
        dynamicSize: true,
        minHeight: 60,
        maxHeight: 300,
        minWidth: 220,
        maxWidth: 400,
      }
    ]
  },

  note: {
    title: 'Note',
    accentColor: 'blue',
    icon: 'StickyNote',
    description: 'Add annotations and notes',
    handles: [],
    inputFields: [
      {
        key: 'note',
        type: 'textarea',
        label: 'Note Content',
        defaultValue: '',
        placeholder: 'Enter your note...',
        dynamicSize: true,
        minHeight: 60,
        maxHeight: 300,
        minWidth: 220,
        maxWidth: 400,
      }
    ]
  }
};

