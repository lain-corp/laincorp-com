export type ProposalStatus = 'open' | 'approved' | 'rejected';

export interface Proposal {
  id: number;
  title: string;
  description: string;
  votesYes: number;
  votesNo: number;
  status: ProposalStatus;
}
