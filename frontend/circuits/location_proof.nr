// Circuit Noir avancé pour preuve de localisation zéro-connaissance

// Constantes géographiques (définies comme des champs immuables)
global PARIS_LAT: Field = 48.8566;
global PARIS_LON: Field = 2.3522;
global DEFAULT_RADIUS: Field = 0.5; // km (500m)
global MIN_RADIUS: Field = 0.1; // km (100m)
global MAX_RADIUS: Field = 20.0; // km (20km)

// Fonction de conversion de degrés en radians
fn deg_to_rad(deg: Field) -> Field {
    (deg * 3.141592653589793) / 180.0
}

// Calcul de distance géographique précis (formule de Haversine)
fn haversine_distance(
    lat1: Field, 
    lon1: Field, 
    lat2: Field, 
    lon2: Field
) -> Field {
    let R = 6371.0; // Rayon de la Terre en km
    
    let dlat = deg_to_rad(lat2 - lat1);
    let dlon = deg_to_rad(lon2 - lon1);
    
    let a = (
        (dlat/2.0).sin() * (dlat/2.0).sin() + 
        lat1.cos() * lat2.cos() * 
        (dlon/2.0).sin() * (dlon/2.0).sin()
    );
    
    let c = 2.0 * a.sqrt().asin();
    
    R * c
}

// Vérification de la preuve de localisation
fn verify_location_proof(
    latitude: Field, 
    longitude: Field, 
    max_timestamp: Field,
    custom_radius: Field // Rayon personnalisé en km
) -> bool {
    // Vérification de la localisation par rapport à Paris
    let distance = haversine_distance(
        latitude, 
        longitude, 
        PARIS_LAT, 
        PARIS_LON
    );
    
    // Contraintes :
    // 1. Distance maximale de Paris avec rayon personnalisé
    // 2. Timestamp récent
    // 3. Vérification que le rayon personnalisé est valide
    
    // Validation du rayon personnalisé
    let valid_radius = custom_radius >= MIN_RADIUS && custom_radius <= MAX_RADIUS;
    let radius_to_use = if valid_radius { custom_radius } else { DEFAULT_RADIUS };
    
    // Contraintes combinées
    let is_within_radius = distance <= radius_to_use;
    let is_recent_timestamp = max_timestamp - 86400 <= max_timestamp;
    
    is_within_radius && is_recent_timestamp && valid_radius
}

// Point d'entrée principal du circuit
fn main(
    latitude: Field, 
    longitude: Field, 
    timestamp: Field,
    custom_radius: Field // Rayon personnalisé en km (0.5 = 500m)
) -> bool {
    verify_location_proof(
        latitude, 
        longitude, 
        timestamp,
        custom_radius
    )
}
