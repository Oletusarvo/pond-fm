class RequestBuilder {
  private query: Partial<RequestInit>;

  constructor() {
    this.query = {};
  }

  /**Returns the constructed request and resets. */
  build() {
    const builtQuery = { ...this.query };
    this.query = {};
    return builtQuery;
  }

  /**Sets the body of the request. Will run the payload through JSON.stringify. */
  body(payload: Record<string, any>) {
    this.query.body = JSON.stringify(payload);
    return this;
  }

  formData(payload: FormData) {
    this.query.body = payload;
    return this;
  }

  /**Sets the credentials-field of the request to "include". */
  includeCredentials() {
    this.query.credentials = 'include';
    return this;
  }

  /**Sets the method to GET. */
  get() {
    this.query.method = 'GET';
    return this;
  }
  /**Sets the method to POST. */
  post() {
    this.query.method = 'POST';
    return this;
  }
  /**Sets the method to PUT. */
  put() {
    this.query.method = 'PUT';
    return this;
  }

  patch() {
    this.query.method = 'PATCH';
    return this;
  }
  /**Sets the method to DELETE. */
  del() {
    this.query.method = 'DELETE';
    return this;
  }

  /**Assigns the application/json Content-Type header. */
  json() {
    this.query = {
      ...this.query,
      headers: {
        ...this.query.headers,
        'Content-Type': 'application/json',
      },
    };
    return this;
  }

  authorization(token: string) {
    this.query = {
      ...this.query,
      headers: {
        ...this.query.headers,
        'Authorization': `Bearer ${token}`
      }
    }
    return this;
  }

  file(f: File) {
    this.query = {
      ...this.query,
      headers: {
        ...this.query.headers,
        'Content-Type': f.type,
        'Content-Length': f.size.toString(),
      },
      body: f,
    }
    return this;
  }
}

export const requestBuilder = new RequestBuilder();
