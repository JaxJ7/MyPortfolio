$port = 5500
$root = $PSScriptRoot
if (-not $root) { $root = 'd:\codes\MyPortfolio' }

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.gif'  = 'image/gif'
    '.ico'  = 'image/x-icon'
    '.pdf'  = 'application/pdf'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.ttf'  = 'font/ttf'
    '.eml'  = 'message/rfc822'
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Output "=========================================================="
    Write-Output "  MyPortfolio Local Server Running at:"
    Write-Output "  http://localhost:$port/"
    Write-Output "=========================================================="
    Write-Output "Serving files from: $root"
    Write-Output "Press Ctrl+C to stop the server."
} catch {
    Write-Error ("Failed to start listener on port " + $port + ": " + $_.Exception.Message)
    exit 1
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Add CORS & caching headers
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Cache-Control", "no-cache")

        $rawUrl = $request.Url.LocalPath
        $relPath = [System.Uri]::UnescapeDataString($rawUrl.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($relPath)) {
            $relPath = 'index.html'
        }

        # Resolve local file path safely
        $localPath = [System.IO.Path]::GetFullPath((Join-Path $root ($relPath -replace '/', '\')))

        if ($localPath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase) -and (Test-Path $localPath -PathType Leaf)) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLowerInvariant()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
            $response.ContentType = $contentType
            $response.StatusCode = 200

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $relPath")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # ignore client disconnects
    }
}
