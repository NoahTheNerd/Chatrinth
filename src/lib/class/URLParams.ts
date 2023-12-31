/*
* ixNoah would like to extend his thanks to the ChatTriggers development team for whatever the fuck this is!
*/
export class URLParams {
    inner: URLSearchParams;
  
    constructor(obj: Record<string, unknown>) {
      const inner = new URLSearchParams();
      for (const property in obj) {
        switch (typeof obj[property]) {
          case 'string':
            inner.append(property, obj[property] as string);
            break;
          case 'bigint':
            inner.append(property, (obj[property] as bigint).toString());
            break;
          case 'boolean':
            inner.append(property, (obj[property] as boolean).toString());
            break;
          case 'function':
            throw new Error('Cannot add function to url parameters');
          case 'number':
            inner.append(property, (obj[property] as number).toString());
            break;
          case 'object':
            if (Array.isArray(obj[property])) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (obj[property] as any[]).forEach(e => inner.append(property, e.toString()));
            } else {
              inner.append(property, JSON.stringify(obj[property] as object));
            }
            break;
          case 'symbol':
            {
              const description = (obj[property] as symbol).description;
              if (!description) throw new Error('Invalid symbol');
              inner.append(property, description);
            }
            break;
          case 'undefined':
            break;
        }
      }
      this.inner = inner;
    }
  
    toString(): string {
      return this.inner.toString();
    }
  }