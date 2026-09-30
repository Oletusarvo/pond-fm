import { createCursor } from "./cursor";

export class FeedBuilder {
  constructor(private pageSize: number) {}
  /**Omits the last item of the provided array if there are more items than the defined page size of the repository. */
  pruneData(data: any[]) {
    return data.length > this.pageSize ? data.slice(0, -1) : data;
  }

  /**Prunes the data and creates a cursor pointing to the pruned item; allowing pagination. */
  withCursor(data: any[]) {
    return {
      items: this.pruneData(data),
      cursor: createCursor(data, this.pageSize),
    };
  }
}
