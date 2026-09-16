export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 最新开奖
    if (url.pathname === "/api/latest") {
      try {
        const r = await fetch(
          "https://macaumarksix.com/api/macaujc2.com",
          {
            headers: {
              "User-Agent": "MacauLunHui-Web/1.0"
            }
          }
        );

        if (!r.ok) {
          throw new Error(`upstream HTTP ${r.status}`);
        }

        const data = await r.json();

        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          }
        });
      } catch (e) {
        return new Response(
          JSON.stringify({ error: e.message }),
          {
            status: 502,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    // 历史开奖
    if (url.pathname === "/api/history") {
      try {
        const issue = url.searchParams.get("issue");

        if (!issue) {
          return new Response(
            JSON.stringify({ error: "缺少 issue 参数" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        }

        const target =
          "https://history.macaumarksix.com/history/macaujc2/expect/" +
          encodeURIComponent(issue);

        const r = await fetch(target, {
          headers: {
            "User-Agent": "MacauLunHui-Web/1.0"
          }
        });

        if (!r.ok) {
          throw new Error(`upstream HTTP ${r.status}`);
        }

        const data = await r.json();

        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          }
        });
      } catch (e) {
        return new Response(
          JSON.stringify({ error: e.message }),
          {
            status: 502,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    // 其他请求交给网页静态文件
    return env.ASSETS.fetch(request);
  }
};
