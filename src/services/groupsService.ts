// Placeholder groups service. Replace with real schema integration when ready.
export type Group = {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
};

export const groupsService = {
  async listMyGroups(_userId: string): Promise<Group[]> {
    // TODO: implement when groups schema is ready
    return [];
  },
  async sendToGroup(_params: { senderId: string; groupId: string; content: string }): Promise<void> {
    // TODO: implement when groups schema is ready
    return;
  },
};
