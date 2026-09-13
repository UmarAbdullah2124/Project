import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { ProjectCard } from './project-card'

const meta: Meta<typeof ProjectCard> = {
  title: 'Custom/ProjectCard',
  component: ProjectCard,
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <DndContext>
          <SortableContext items={['story-project']}>
            <Story />
          </SortableContext>
        </DndContext>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ProjectCard>

export const WithDueDate: Story = {
  args: {
    project: {
      id: 'story-project',
      title: 'Revamp the design of website',
      dueDate: String(Date.now() + 7 * 24 * 60 * 60 * 1000),
      client: { id: 'c1', name: 'Acme Corp' },
    },
  },
}

export const WithoutDueDate: Story = {
  args: {
    project: {
      id: 'story-project',
      title: 'Internal security audit',
      dueDate: null,
      client: { id: 'c2', name: 'Globex Inc' },
    },
  },
}

export const LongTitle: Story = {
  args: {
    project: {
      id: 'story-project',
      title:
        'Comprehensive enterprise-wide infrastructure migration and security compliance overhaul project',
      dueDate: String(Date.now() + 30 * 24 * 60 * 60 * 1000),
      client: { id: 'c3', name: 'Very Long Client Name Holdings LLC' },
    },
  },
}
