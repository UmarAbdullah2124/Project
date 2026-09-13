import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatCard } from './stat-card'

const meta: Meta<typeof StatCard> = {
  title: 'Custom/StatCard',
  component: StatCard,
}

export default meta
type Story = StoryObj<typeof StatCard>

export const TotalClients: Story = {
  args: { label: 'Total Clients', value: 24 },
}

export const TotalMrr: Story = {
  args: { label: 'Total MRR', value: '$108,300' },
}

export const ActiveClients: Story = {
  args: { label: 'Active Clients', value: 18 },
}
