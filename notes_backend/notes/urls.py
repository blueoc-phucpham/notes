from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("api/v1/users/", include("users.urls")),
    path("api/v1/notes/", include("core.urls")),
    path("api/v1/docs/openapi.yaml", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/v1/docs",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
