from django.shortcuts import redirect

class HTTPSRedirectMiddleware:
    """
    Redirect any HTTPS request to HTTP in development.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.is_secure():
            # Replace 'http' in the URL
            url = request.build_absolute_uri(request.get_full_path())
            url = url.replace('https://', 'http://')
            return redirect(url)
        response = self.get_response(request)
        return response
