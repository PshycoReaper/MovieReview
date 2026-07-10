export type ContactRequestType = 'review_change' | 'movie_request';

export type ContactRequestStatus = 'pending' | 'in_progress' | 'resolved';

export interface ContactRequest {
  _id?: string;
  requestType: ContactRequestType;
  fullName: string;
  email: string;
  movieTitle?: string;
  message: string;
  status?: ContactRequestStatus;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}
