// DTO

export type BackboneListReply = Backbone[];

// Model

export type Backbone = {
  id: number;
  name: string;
  description: string;
  params_schema: Record<string, unknown>;
};
