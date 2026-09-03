<?php

header('Content-Type: application/json; charset=utf-8');


// ==========================================
// KONFIGURASI
// ==========================================

$apiKey = 'MASUKKAN_GOOGLE_API_KEY_DI_SINI';

$placeId = 'MASUKKAN_PLACE_ID_DI_SINI';


// ==========================================
// VALIDASI
// ==========================================

if (
    empty($apiKey) ||
    empty($placeId)
) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Google API Key atau Place ID belum dikonfigurasi.'
    ]);

    exit;
}


// ==========================================
// REQUEST GOOGLE PLACES API
// ==========================================

$url = 'https://places.googleapis.com/v1/places/' .
       urlencode($placeId);


// Field yang kita butuhkan
$fieldMask = implode(',', [
    'id',
    'displayName',
    'rating',
    'userRatingCount',
    'reviews',
    'googleMapsLinks'
]);


$ch = curl_init();

curl_setopt_array($ch, [

    CURLOPT_URL => $url,

    CURLOPT_RETURNTRANSFER => true,

    CURLOPT_HTTPHEADER => [

        'Content-Type: application/json',

        'X-Goog-Api-Key: ' . $apiKey,

        'X-Goog-FieldMask: ' . $fieldMask

    ],

    CURLOPT_TIMEOUT => 15

]);


$response = curl_exec($ch);

$httpCode = curl_getinfo(
    $ch,
    CURLINFO_HTTP_CODE
);

$curlError = curl_error($ch);

curl_close($ch);


// ==========================================
// ERROR CURL
// ==========================================

if ($response === false) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Gagal menghubungi Google API.',
        'error' => $curlError
    ]);

    exit;
}


// ==========================================
// ERROR GOOGLE API
// ==========================================

if ($httpCode < 200 || $httpCode >= 300) {

    http_response_code($httpCode);

    echo json_encode([
        'success' => false,
        'message' => 'Google API mengembalikan error.',
        'google_response' => json_decode(
            $response,
            true
        )
    ]);

    exit;
}


// ==========================================
// DECODE RESPONSE
// ==========================================

$data = json_decode(
    $response,
    true
);


if (!$data) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Response Google tidak valid.'
    ]);

    exit;
}


// ==========================================
// AMBIL REVIEW
// ==========================================

$reviews = [];

if (
    isset($data['reviews']) &&
    is_array($data['reviews'])
) {

    foreach ($data['reviews'] as $review) {

        $authorName =
            $review['authorAttribution']['displayName']
            ?? 'Pelanggan Google';

        $profilePhoto =
            $review['authorAttribution']['photoUri']
            ?? '';

        $rating =
            $review['rating']
            ?? 0;

        $text =
            $review['text']['text']
            ?? '';

        $publishTime =
            $review['publishTime']
            ?? '';

        $googleMapsUri =
            $review['googleMapsUri']
            ?? '';

        $reviews[] = [

            'author_name' => $authorName,

            'profile_photo_url' => $profilePhoto,

            'rating' => $rating,

            'text' => $text,

            'publish_time' => $publishTime,

            'google_maps_uri' => $googleMapsUri

        ];
    }
}


// ==========================================
// LINK GOOGLE
// ==========================================

$writeReviewUrl =
    $data['googleMapsLinks']['writeAReviewUri']
    ?? '';

$reviewsUrl =
    $data['googleMapsLinks']['reviewsUri']
    ?? '';


// ==========================================
// RESPONSE WEBSITE
// ==========================================

echo json_encode([

    'success' => true,

    'business' => [

        'name' =>
            $data['displayName']['text']
            ?? 'Orc Transportasi',

        'rating' =>
            $data['rating']
            ?? 0,

        'total_reviews' =>
            $data['userRatingCount']
            ?? 0

    ],

    'reviews' => $reviews,

    'google' => [

        'write_review_url' =>
            $writeReviewUrl,

        'reviews_url' =>
            $reviewsUrl

    ]

], JSON_UNESCAPED_UNICODE);

?>