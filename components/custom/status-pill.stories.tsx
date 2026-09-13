import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatusPill } from './status-pill'

const meta: Meta<typeof StatusPill> = {
  title: 'Custom/StatusPill',
  component: StatusPill,
}

export default meta
type Story = StoryObj<typeof StatusPill>

export const Active: Story = {
  args: { status: 'active' },
}

export const Onboarding: Story = {
  args: { status: 'onboarding' },
}

export const Inactive: Story = {
  args: { status: 'inactive' },
}

export const Overdue: Story = {
  args: { status: 'overdue' },
}