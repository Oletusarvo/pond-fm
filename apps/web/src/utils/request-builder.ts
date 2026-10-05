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

  /**Sets the body to a FormData-object. */
  formData(payload: FormData) {
    this.query.body = payload;
    return this;
  }

  /**Sets the credentials-field of the request to "include". */
  includeCredentials() {
    this.query.credentials = "include";
    return this;
  }

  /**Sets the method to GET. */
  get() {
    this.query.method = "GET";
    return this;
  }
  /**Sets the method to POST. */
  post() {
    this.query.method = "POST";
    return this;
  }
  /**Sets the method to PUT. */
  put() {
    this.query.method = "PUT";
    return this;
  }

  /**Sets the method to PATCH. */
  patch() {
    this.query.method = "PATCH";
    return this;
  }
  /**Sets the method to DELETE. */
  delete() {
    this.query.method = "DELETE";
    return this;
  }

  /**Assigns the application/json Content-Type header. */
  json() {
    this.query = {
      ...this.query,
      headers: {
        ...this.query.headers,
        "Content-Type": "application/json",
      },
    };
    return this;
  }

  /**Sets the Authorization-header as a Bearer <token> value. */
  authorization(token: string) {
    this.query = {
      ...this.query,
      headers: {
        ...this.query.headers,
        Authorization: `Bearer ${token}`,
      },
    };
    return this;
  }

  /**Adds a file as the body of the request. Also sets the Content-Type and Content-Length headers. */
  file(f: File) {
    this.query = {
      ...this.query,
      headers: {
        ...this.query.headers,
        "Content-Type": f.type,
        "Content-Length": f.size.toString(),
      },
      body: f,
    };
    return this;
  }

  /**Sets the Cache-Control header to no-store. */
  noStore() {
    this.query = {
      ...this.query,
      headers: {
        ...this.query.headers,
        "Cache-Control": "no-store",
      },
    };
    return this;
  }
  signal(signal: AbortController["signal"]) {
    this.query = {
      ...this.query,
      signal,
    };
    return this;
  }
}

/**Utility-object for constructing http requests. */
export const requestBuilder = new RequestBuilder();
