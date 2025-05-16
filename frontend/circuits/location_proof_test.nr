// Tests pour le circuit de preuve de localisation

// Import du circuit principal
use dep::std;

// Test avec un rayon personnalisé valide
#[test]
fn test_valid_custom_radius() {
    // Coordonnées proches de Paris
    let latitude = 48.8574;
    let longitude = 2.3568;
    let timestamp = 1716400056; // 15 mai 2025
    let custom_radius = 0.5; // 500m
    
    // Vérification avec le circuit principal
    let result = main(latitude, longitude, timestamp, custom_radius);
    
    // Le résultat devrait être vrai car les coordonnées sont à Paris
    // et le rayon personnalisé est valide
    assert(result);
}

// Test avec un rayon personnalisé trop petit
#[test]
fn test_too_small_radius() {
    // Coordonnées proches de Paris
    let latitude = 48.8574;
    let longitude = 2.3568;
    let timestamp = 1716400056; // 15 mai 2025
    let custom_radius = 0.05; // 50m (trop petit, minimum 100m)
    
    // Vérification avec le circuit principal
    let result = main(latitude, longitude, timestamp, custom_radius);
    
    // Le résultat devrait être faux car le rayon est trop petit
    assert(!result);
}

// Test avec un rayon personnalisé trop grand
#[test]
fn test_too_large_radius() {
    // Coordonnées proches de Paris
    let latitude = 48.8574;
    let longitude = 2.3568;
    let timestamp = 1716400056; // 15 mai 2025
    let custom_radius = 25.0; // 25km (trop grand, maximum 20km)
    
    // Vérification avec le circuit principal
    let result = main(latitude, longitude, timestamp, custom_radius);
    
    // Le résultat devrait être faux car le rayon est trop grand
    assert(!result);
}

// Test avec une localisation hors du rayon
#[test]
fn test_location_outside_radius() {
    // Coordonnées de Lyon (loin de Paris)
    let latitude = 45.7640;
    let longitude = 4.8357;
    let timestamp = 1716400056; // 15 mai 2025
    let custom_radius = 5.0; // 5km
    
    // Vérification avec le circuit principal
    let result = main(latitude, longitude, timestamp, custom_radius);
    
    // Le résultat devrait être faux car Lyon est trop loin de Paris
    assert(!result);
}
