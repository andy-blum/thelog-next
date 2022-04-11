import Document, { Html, Head, NextScript, Main } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static getInitialProps = async (ctx) => {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en-US">
        <Head />
        <body>
          <Main />
          <script src='https://cdn.jsdelivr.net/npm/@widgetbot/crate@3'
            async
            defer
            dangerouslySetInnerHTML={{
              __html: `
                new Crate({
                  server: '849305767730479125',
                  channel: '849305768532377622'
                });
              `,
            }}
          >
          </script>
          <NextScript />
        </body>
      </Html>
    );
  }
}
