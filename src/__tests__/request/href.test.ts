import http from 'http';
import Koa from '../../application';
import Context from '../../context';
import context from '../helpers/context';

describe('ctx.href', () => {
  it('should return the full request url', () => {
    const req = {
      url: '/users/1?next=/dashboard',
      headers: {
        host: 'localhost'
      }
    };
    const ctx = context(req);
    expect(ctx.href).toBe('http://localhost/users/1?next=/dashboard');
    // change it also work
    ctx.url = '/foo/users/1?next=/dashboard';
    expect(ctx.href).toBe('http://localhost/users/1?next=/dashboard');
  });

  it('should work with `GET http://example.com/foo`', () => {
    return new Promise(resolve => {
      const app = new Koa();
      app.use((ctx: Context) => {
        ctx.body = ctx.href;
      });
      const server = app.listen(function() {
        const address = this.address();
        http.get({
          host: 'localhost',
          path: 'http://example.com/foo',
          port: address.port
        }, res => {
          expect(res.statusCode).toBe(200);
          let buf = '';
          res.setEncoding('utf8');
          res.on('data', s => buf += s);
          res.on('end', () => {
            server.close();
            expect(buf).toBe('http://example.com/foo');
            resolve();
          });
        });
      });
    });
  });
});
