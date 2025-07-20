const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!/^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\//.test(url)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid Instagram URL.'
      }), { headers: corsHeaders });
    }

    const response = await fetch('https://saveig.app/api/ajaxSearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `q=${encodeURIComponent(url)}`
    });

    const result = await response.json();

    if (!result.status || !result.data || !result.data.medias) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No media found.'
      }), { headers: corsHeaders });
    }

    const mediaList = result.data.medias.map((media: any) => ({
      quality: media.quality || 'default',
      url: media.url,
      size: media.formattedSize || 'unknown',
    }));

    return new Response(JSON.stringify({
      success: true,
      data: {
        type: result.data.type || 'post',
        thumbnail: result.data.thumbnail,
        downloadOptions: mediaList
      }
    }), { headers: corsHeaders });

  } catch (e) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), { headers: corsHeaders });
  }
});
