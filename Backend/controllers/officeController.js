// Backend/controllers/officeController.js

// Haversine distance calculation in kilometers
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal point (e.g. 1.8 km)
}

// Mock Categories
const MOCK_CATEGORIES = [
  { id: 1, code: 'all', name: 'All Office Categories', icon: 'AccountBalance' },
  { id: 2, code: 'tahsildar', name: 'Tahsildar Office', icon: 'AccountBalance' },
  { id: 3, code: 'panchayat', name: 'Panchayat Office', icon: 'Villa' },
  { id: 4, code: 'municipal', name: 'Municipal Office', icon: 'Apartment' },
  { id: 5, code: 'csc', name: 'Common Service Center (CSC)', icon: 'Computer' },
  { id: 6, code: 'collectorate', name: 'District Collectorate', icon: 'AssuredWorkload' },
  { id: 7, code: 'dbt_bank', name: 'DBT-Linked Bank', icon: 'AccountBalanceWallet' },
  { id: 8, code: 'post_office', name: 'Post Office / IPPB', icon: 'LocalPostOffice' },
  { id: 9, code: 'aadhaar_center', name: 'Aadhaar Center', icon: 'Fingerprint' },
  { id: 10, code: 'bdo', name: 'Block Dev Office (BDO)', icon: 'Engineering' }
];

// Seeded Government Offices dataset across India (Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Pune, Jaipur)
const MOCK_OFFICES = [
  {
    id: 101,
    name: 'Tahsildar & Revenue Office - Andheri West',
    category_code: 'tahsildar',
    category_name: 'Tahsildar Office',
    address: 'Old Police Station Compound, S.V. Road, Andheri West',
    district: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400058',
    latitude: 19.1197,
    longitude: 72.8464,
    contact_number: '+91 22 2620 4589',
    email: 'tahsildar.andheri@maharashtra.gov.in',
    officer_name: 'Mr. Suresh Patil (Tehsildar)',
    timings: '09:30 AM - 05:30 PM (Mon-Sat)',
    is_open: true,
    wheelchair_accessible: true,
    services: ['Income Certificate', 'Community / Caste Certificate', 'Solvency Certificate', 'Land Revenue Verification', 'Domicile Certificate'],
    parking: 'Free Public Parking Available',
    public_transport: '5 mins walk from Andheri Railway Station / Metro'
  },
  {
    id: 102,
    name: 'Common Service Center (CSC) - Bandra e-Seva',
    category_code: 'csc',
    category_name: 'Common Service Center (CSC)',
    address: 'Shop 12, Hill Road, Near Elco Market, Bandra West',
    district: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    latitude: 19.0544,
    longitude: 72.8402,
    contact_number: '+91 98201 45902',
    email: 'csc.bandra@eshop.gov.in',
    officer_name: 'Vikas Kadam (CSC VLE Manager)',
    timings: '09:00 AM - 08:00 PM (Daily)',
    is_open: true,
    wheelchair_accessible: true,
    services: ['Aadhaar Print & Update', 'PMAY Online Application', 'PM-KISAN E-KYC', 'Ayushman Bharat Card Printing', 'Ration Card Update'],
    parking: 'Paid Two-Wheeler Parking',
    public_transport: '10 mins bus from Bandra Station'
  },
  {
    id: 103,
    name: 'Gram Panchayat Administrative Office - Thane Rural',
    category_code: 'panchayat',
    category_name: 'Panchayat Office',
    address: 'Main Road, Village Post Ghodbunder, Thane',
    district: 'Thane',
    state: 'Maharashtra',
    pincode: '400607',
    latitude: 19.2684,
    longitude: 72.9682,
    contact_number: '+91 22 2540 1122',
    email: 'panchayat.ghodbunder@gov.in',
    officer_name: 'Gram Sevak Nitin Deshmukh',
    timings: '10:00 AM - 05:00 PM (Mon-Fri)',
    is_open: true,
    wheelchair_accessible: false,
    services: ['Rural Housing Verification', 'NREGA Job Card', 'Village Water Connection', 'BPL Survey Registration'],
    parking: 'Open Ground Parking',
    public_transport: 'Auto-rickshaw from Thane Station'
  },
  {
    id: 104,
    name: 'State Bank of India (DBT Nodal Branch) - Fort',
    category_code: 'dbt_bank',
    category_name: 'DBT-Linked Bank',
    address: 'Main Building, Horniman Circle, Fort',
    district: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    latitude: 18.9322,
    longitude: 72.8335,
    contact_number: '+91 22 2266 0123',
    email: 'dbt.fort@sbi.co.in',
    officer_name: 'Priya Nair (Chief Nodal Officer)',
    timings: '10:00 AM - 04:00 PM (Mon-Sat, 1st & 3rd)',
    is_open: true,
    wheelchair_accessible: true,
    services: ['Direct Benefit Transfer Account Seeding', 'Aadhaar-NPCI Mapper Verification', 'PM-KISAN DBT Beneficiary Account', 'Sukanya Samriddhi Yojana'],
    parking: 'Street Parking (Pay & Park)',
    public_transport: '5 mins walk from CST Railway Station'
  },
  {
    id: 105,
    name: 'UIDAI Aadhaar Seva Kendra - Dadar',
    category_code: 'aadhaar_center',
    category_name: 'Aadhaar Center',
    address: '2nd Floor, Kohinoor City Mall, Near Dadar Station East',
    district: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400014',
    latitude: 19.0178,
    longitude: 72.8478,
    contact_number: '1947',
    email: 'help@uidai.gov.in',
    officer_name: 'UIDAI Center Supervisor',
    timings: '08:30 AM - 06:30 PM (Daily)',
    is_open: true,
    wheelchair_accessible: true,
    services: ['Fresh Aadhaar Enrollment', 'Biometric Iris & Fingerprint Update', 'Mobile Number & Address Linkage', 'Child Aadhaar Registration'],
    parking: 'Mall Covered Parking',
    public_transport: '2 mins walk from Dadar East Station'
  },
  {
    id: 106,
    name: 'India Post Payments Bank (IPPB) Head Post Office',
    category_code: 'post_office',
    category_name: 'Post Office / IPPB',
    address: 'GPO Building, CST Complex, Fort',
    district: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    latitude: 18.9400,
    longitude: 72.8355,
    contact_number: '+91 22 2262 0951',
    email: 'ippb.mumbai@indiapost.gov.in',
    officer_name: 'Postmaster General Office',
    timings: '09:00 AM - 05:00 PM (Mon-Sat)',
    is_open: true,
    wheelchair_accessible: true,
    services: ['Doorstep IPPB Account Opening', 'DBT Aadhaar Seeding', 'Postal Savings Schemes', 'Aadhaar Mobile Update'],
    parking: 'Public Pay & Park',
    public_transport: 'Adjacent to CST Railway Station'
  }
];

// Scheme Required Office Mappings
const SCHEME_OFFICE_REQUIREMENTS = {
  1: ['tahsildar', 'panchayat', 'dbt_bank'], // PMAY
  2: ['tahsildar', 'dbt_bank', 'csc'],       // PM-KISAN
  3: ['csc', 'aadhaar_center', 'dbt_bank'],   // Ayushman Bharat
  4: ['tahsildar', 'collectorate'],           // Scholarship
  5: ['bdo', 'panchayat']                     // MGNREGA
};

exports.getNearbyOffices = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat) || 19.0760; // Default Mumbai Lat
    const userLng = parseFloat(req.query.lng) || 72.8777; // Default Mumbai Lng
    const category = req.query.category || 'all';
    const district = req.query.district || '';
    const search = (req.query.search || '').toLowerCase();
    const openNow = req.query.openNow === 'true';
    const wheelchair = req.query.wheelchair === 'true';

    let results = MOCK_OFFICES.map(office => {
      const distanceKm = calculateHaversineDistance(userLat, userLng, office.latitude, office.longitude);
      const drivingTimeMins = Math.max(2, Math.round(distanceKm * 3.5)); // Approx driving speed
      return {
        ...office,
        distance_km: distanceKm,
        travel_time: `${drivingTimeMins} mins drive (${Math.round(drivingTimeMins * 3)} mins walk)`,
        google_maps_url: `https://www.google.com/maps/dir/?api=1&destination=${office.latitude},${office.longitude}`
      };
    });

    // Category Filter
    if (category && category !== 'all') {
      results = results.filter(o => o.category_code === category);
    }

    // District Filter
    if (district) {
      results = results.filter(o => o.district.toLowerCase() === district.toLowerCase());
    }

    // Search Query Filter
    if (search) {
      results = results.filter(o =>
        o.name.toLowerCase().includes(search) ||
        o.address.toLowerCase().includes(search) ||
        o.district.toLowerCase().includes(search) ||
        o.pincode.includes(search) ||
        o.services.some(s => s.toLowerCase().includes(search))
      );
    }

    // Open Now Filter
    if (openNow) {
      results = results.filter(o => o.is_open);
    }

    // Wheelchair Filter
    if (wheelchair) {
      results = results.filter(o => o.wheelchair_accessible);
    }

    // Sort by nearest distance ascending
    results.sort((a, b) => a.distance_km - b.distance_km);

    res.json({
      success: true,
      userLocation: { latitude: userLat, longitude: userLng },
      totalOffices: results.length,
      categories: MOCK_CATEGORIES,
      offices: results
    });
  } catch (error) {
    console.error('Error in getNearbyOffices:', error);
    res.status(500).json({ success: false, message: 'Error fetching nearby offices' });
  }
};

exports.getOfficeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const office = MOCK_OFFICES.find(o => o.id === id) || MOCK_OFFICES[0];
    
    res.json({
      success: true,
      office: {
        ...office,
        google_maps_url: `https://www.google.com/maps/dir/?api=1&destination=${office.latitude},${office.longitude}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching office details' });
  }
};

exports.getOfficesForScheme = async (req, res) => {
  try {
    const schemeId = parseInt(req.params.id) || 1;
    const requiredCategoryCodes = SCHEME_OFFICE_REQUIREMENTS[schemeId] || ['tahsildar', 'csc', 'dbt_bank'];

    const requiredOffices = MOCK_OFFICES.filter(o => requiredCategoryCodes.includes(o.category_code));

    res.json({
      success: true,
      schemeId,
      requiredCategories: requiredCategoryCodes,
      recommendedOffices: requiredOffices.map(o => ({
        ...o,
        distance_km: 2.4,
        travel_time: '8 mins drive',
        google_maps_url: `https://www.google.com/maps/dir/?api=1&destination=${o.latitude},${o.longitude}`
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching scheme recommended offices' });
  }
};

exports.getCategories = async (req, res) => {
  res.json({ success: true, categories: MOCK_CATEGORIES });
};
