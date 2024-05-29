interface BucketItem<T> {
  id: string;
  data: T;
}

class Bucket<T> {
  private buckets: Record<string, BucketItem<T>[]>;

  constructor() {
    this.buckets = {};
  }

  add(key: string, id: string, data: T) {
    if (!this.buckets[key]) {
      this.buckets[key] = [];
    }
    this.buckets[key].push({ id, data });
  }

  remove(key: string | null | undefined, id: string) {
    if (key && this.buckets[key]) {
      const index = this.buckets[key].findIndex((obj) => obj.id === id);
      if (index !== -1) {
        this.buckets[key].splice(index, 1);
      }
    } else {
      for (const k in this.buckets) {
        const index = this.buckets[k].findIndex((obj) => obj.id === id);
        if (index !== -1) {
          this.buckets[k].splice(index, 1);
        }
      }
    }
  }

  get(lang: string): BucketItem<T>[] {
    return this.buckets[lang] || [];
  }

  getAllBuckets(): Record<string, BucketItem<T>[]> {
    return { ...this.buckets };
  }
}

export default Bucket;
