from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("users/", include("users.urls")),
    path("notes/", include("core.urls")),
    path("docs/openapi.yaml", SpectacularAPIView.as_view(), name="schema"),
    path(
        "docs",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
