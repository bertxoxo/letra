export type LetterCategory =
  | "Love"
  | "Friendship"
  | "Family"
  | "Apology"
  | "Gratitude"
  | "Grief"
  | "Other";

export type LetterVisibility = "PUBLIC" | "PRIVATE";
export type LetterPublishType = "PUBLISH_ONLY" | "PUBLISH_AND_EMAIL";

export interface Letter {
  id: string;
  slug: string;
  title: string;
  message: string;
  category: LetterCategory;
  recipientName: string;
  recipientEmail: string | null;
  senderName: string | null;
  senderEmail: string;
  songName: string | null;
  artistName: string | null;
  albumCover: string | null;
  visibility: LetterVisibility;
  publishType: LetterPublishType;
  views: number;
  reactions: number;
  createdAt: string;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  letterId: string;
  message: string;
  createdAt: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  albumCover: string;
  spotifyUrl: string;
}
