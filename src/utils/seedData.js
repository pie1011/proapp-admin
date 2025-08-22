import { supabase } from '../lib/supabase';

const fakeQuotes = [
  {
    customer_name: "Michael Rodriguez",
    email: "michael.rodriguez@email.com",
    phone_primary: "(555) 234-5678",
    phone_secondary: "(555) 234-5679",
    client_type: "Homeowner",
    purchased: "Yes",
    field_measure: "Yes",
    delivery: "Yes",
    pickup_location: "Home Depot - San Jose",
    pickup_date: "2024-08-25",
    uninstall: "Yes",
    haul_away: "Yes",
    street: "123 Oak Street",
    city: "San Jose",
    zip: "95110",
    home_type: "Single Family",
    floor: "1st Floor",
    stairs: "No",
    parking: "Driveway",
    preferred_date: "2024-08-28",
    preferred_time: ["Morning (8am-12pm)"],
    additional_details: "Kitchen remodel - need all appliances installed same day",
    appliances: [
      { type: "Range", brand: "Samsung", model: "NX60T8511SS", specifics: ["Gas Conversion Kit"] },
      { type: "Dishwasher", brand: "Bosch", model: "SHPM78Z55N", specifics: ["Custom Panel Ready"] },
      { type: "Refrigerator", brand: "LG", model: "LRFVS3006S", specifics: ["Counter Depth"] }
    ]
  },
  {
    customer_name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone_primary: "(555) 567-8901",
    client_type: "Homeowner",
    purchased: "Yes",
    field_measure: "No",
    delivery: "Yes",
    pickup_location: "Best Buy - Cupertino",
    uninstall: "No",
    haul_away: "No",
    street: "456 Maple Ave",
    city: "Cupertino",
    zip: "95014",
    home_type: "Townhouse",
    floor: "1st Floor",
    stairs: "No",
    parking: "Street Parking",
    parking_notes: "2-hour limit, will arrange permit",
    preferred_date: "2024-08-30",
    preferred_time: ["Afternoon (12pm-6pm)"],
    additional_details: "New construction - first appliance install",
    appliances: [
      { type: "Washer/Dryer", brand: "Whirlpool", model: "WFC8090GX", specifics: ["Stacked Unit", "Ventless"] }
    ]
  },
  {
    customer_name: "David Kim",
    email: "d.kim@company.com",
    phone_primary: "(555) 789-0123",
    phone_secondary: "(555) 789-0124",
    client_type: "Property Manager",
    company_name: "Bay Area Properties LLC",
    purchased: "No",
    field_measure: "Yes",
    delivery: "No",
    uninstall: "Yes",
    haul_away: "Yes",
    street: "789 Pine Street",
    city: "Palo Alto",
    zip: "94301",
    home_type: "Condo",
    floor: "3rd Floor",
    stairs: "Yes",
    stairs_number: "2 flights",
    stairs_turns: "Yes",
    parking: "Underground Garage",
    gate_code: "1234",
    preferred_date: "2024-09-02",
    preferred_time: ["Morning (8am-12pm)", "Afternoon (12pm-6pm)"],
    additional_details: "Rental property - tenant will be present",
    appliances: [
      { type: "Refrigerator", brand: "GE", model: "GNE27JSMSS", specifics: ["Standard Depth"] },
      { type: "Range", brand: "GE", model: "JGB735SPSS", specifics: ["Gas"] }
    ]
  },
  {
    customer_name: "Jennifer Thompson",
    email: "jen.thompson@email.com",
    phone_primary: "(555) 890-1234",
    client_type: "Homeowner",
    purchased: "Yes",
    field_measure: "Yes",
    delivery: "Yes",
    pickup_location: "Costco - San Francisco",
    pickup_date: "2024-09-05",
    uninstall: "Yes",
    haul_away: "Yes",
    street: "321 Hill Street",
    city: "San Francisco",
    zip: "94110",
    home_type: "Single Family",
    floor: "1st Floor",
    stairs: "Yes",
    stairs_number: "5 steps",
    stairs_turns: "No",
    parking: "Street Parking",
    parking_notes: "Very narrow street - may need hand truck",
    preferred_date: "2024-09-08",
    preferred_time: ["Morning (8am-12pm)"],
    additional_details: "Older home - may need electrical work for dishwasher",
    appliances: [
      { type: "Dishwasher", brand: "KitchenAid", model: "KDFE104KPS", specifics: ["PrintShield Finish"] },
      { type: "Microwave", brand: "KitchenAid", model: "KMHC319ESS", specifics: ["Over Range"] }
    ]
  },
  {
    customer_name: "Robert Martinez",
    email: "robert.martinez@email.com",
    phone_primary: "(555) 901-2345",
    client_type: "Homeowner",
    purchased: "Yes",
    field_measure: "No",
    delivery: "Yes",
    pickup_location: "Lowe's - Mountain View",
    uninstall: "No",
    haul_away: "No",
    street: "654 Cedar Lane",
    city: "Mountain View",
    zip: "94040",
    home_type: "Single Family",
    floor: "1st Floor",
    stairs: "No",
    parking: "Driveway",
    preferred_date: "2024-09-10",
    preferred_time: ["Afternoon (12pm-6pm)"],
    additional_details: "Wine storage unit for home bar area",
    appliances: [
      { type: "Wine Cooler", brand: "NewAir", model: "AWR-290DB", specifics: ["Dual Zone", "29 Bottle"] }
    ]
  }
];

export const seedDatabase = async () => {
  console.log('Starting to seed database...');
  
  for (const quote of fakeQuotes) {
    try {
      // Extract appliances from quote data
      const appliances = quote.appliances;
      delete quote.appliances;
      
      // Add random created_at dates in the last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      quote.created_at = createdAt.toISOString();
      
      console.log('Attempting to insert quote:', quote.customer_name);
      console.log('Quote data:', quote);
      
      // Insert quote
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert(quote)
        .select()
        .single();
        
      if (quoteError) {
        console.error('Quote insertion error:', quoteError);
        throw quoteError;
      }
      
      console.log(`✓ Inserted quote for ${quote.customer_name}`);
      
      // Insert appliances
      for (const appliance of appliances) {
        console.log('Inserting appliance:', appliance);
        
        const { error: applianceError } = await supabase
          .from('appliance_details')
          .insert({
            quote_id: quoteData.id,
            appliance_type: appliance.type,
            brand: appliance.brand,
            model: appliance.model,
            specifics: appliance.specifics
          });
          
        if (applianceError) {
          console.error('Appliance insertion error:', applianceError);
          throw applianceError;
        }
      }
      
      console.log(`✓ Inserted ${appliances.length} appliances for ${quote.customer_name}`);
      
    } catch (error) {
      console.error(`❌ Error inserting quote for ${quote.customer_name}:`, error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      // Don't throw - continue with other quotes
    }
  }
  
  console.log('Database seeding completed!');
};