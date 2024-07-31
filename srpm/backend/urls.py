from django.urls import path
from .views import searchView, translatorView, summarizationView, registerView, loginView, authorRelevanceView, hecRatingView, addToLibraryView, libraryView, impactFactorView, sendOTPView, verifyOTPView, AdminLoginView, AllUsersView, DeleteUserView, recommendationsView


urlpatterns = [
    path('search', searchView),
    path('translate', translatorView),
    path('summarize', summarizationView),
    path('register', registerView),
    path('login', loginView),
    path('authorrelevance', authorRelevanceView),
    path('hecrating', hecRatingView),
    path('addtolibrary', addToLibraryView),
    path('library', libraryView),
    path('impactfactor', impactFactorView),
    path('sendotp', sendOTPView),
    path('verifyotp', verifyOTPView),
    path('adminlogin', AdminLoginView),
    path('allusers', AllUsersView),
    path('deleteuser', DeleteUserView),
    path('recommendations', recommendationsView)
]

