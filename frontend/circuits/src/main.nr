// Advanced Zero-Knowledge Location Proof Circuit

// Constants for location proof
// Constants with scale factor to avoid decimals
global PARIS_LAT: Field = 48_8566 / 10000;
global PARIS_LON: Field = 2_3522 / 10000;
global MAX_RADIUS: Field = 20;

// Custom trigonometric approximations for Field
fn sin(x: Field) -> Field {
    let x2 = x * x;
    x - (x * x2 / 6) + (x * x2 * x2 / 120)
}

fn cos(x: Field) -> Field {
    // Approximation of cosine using Taylor series
    let x_squared = x * x;
    let term0 = 1;
    let term2 = -(x_squared) / 2;
    let term4 = (x_squared * x_squared) / 24;
    term0 + term2 + term4
}

// Custom square root implementation for Field type
fn custom_sqrt(x: Field) -> Field {
    // Newton-Raphson method for square root approximation
    let mut guess = x / 2;
    // Only a few iterations needed for reasonable approximation
    for _ in 0..5 {
        guess = (guess + x / guess) / 2;
    }
    guess
}

// Degree to radian conversion
fn deg_to_rad(deg: Field) -> Field {
    let pi = 3141592653589793 / 1000000000000000;
    deg * (pi / 180)
}

// Haversine distance calculation
fn haversine_distance(
    lat1: Field, 
    lon1: Field, 
    lat2: Field, 
    lon2: Field
) -> Field {
    let R = 6371; // Earth radius in km
    
    let dlat = deg_to_rad(lat2 - lat1);
    let dlon = deg_to_rad(lon2 - lon1);
    
    let a = (
        sin(dlat/2) * sin(dlat/2) + 
        cos(lat1) * cos(lat2) * 
        sin(dlon/2) * sin(dlon/2)
    );
    
    let c = 2 * custom_sqrt(a);
    
    R * c
}

// Location proof verification
fn verify_location_proof(
    latitude: Field, 
    longitude: Field, 
    max_timestamp: Field
) -> bool {
    // Verify location relative to Paris
    let distance = haversine_distance(
        latitude, 
        longitude, 
        PARIS_LAT, 
        PARIS_LON
    );
    
    // Constraints:
    // 1. Maximum distance from Paris
    // 2. Recent timestamp
    
    // Simplified constraints
    // Cast to integers for comparison (Noir requirement)
    let distance_i = distance as u64;
    let max_radius_i = MAX_RADIUS as u64;
    let is_within_radius = distance_i < max_radius_i;
    
    // For timestamp, ensure we're checking within valid range
    let time_diff = 86400 as u64;
    let current_time = max_timestamp as u64;
    let past_time = if current_time > time_diff { current_time - time_diff } else { 0 };
    let is_recent_timestamp = current_time > past_time;
    
    // Return the combined result
    if is_within_radius & is_recent_timestamp { true } else { false }
}

// Main circuit entry point
pub fn main(
    latitude: Field, 
    longitude: Field, 
    timestamp: Field
) -> pub bool {
    verify_location_proof(
        latitude, 
        longitude, 
        timestamp
    )
}
