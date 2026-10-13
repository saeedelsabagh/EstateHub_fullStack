export const initialState = {
  favorites: [],

  filters: {
    search: "",
    propertyType: "all",
    listingType: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: false,
    bathrooms: false,
  },

  newProperty: {
    title: "",
    location: "",
    price: "",
    type: "Apartment",
    beds: "",
    baths: "",
    area: "",
    image: "",
    description: "",
    listingType: "Buy",
  },

  rows: [
    // {
    //   name: "Modern Apartment",
    //   location: "New Cairo",
    //   price: "$185,000",
    //   status: "Approved",
    // },
    // {
    //   name: "Luxury Villa",
    //   location: "Sheikh Zayed",
    //   price: "$420,000",
    //   status: "Pending",
    // },
    // {
    //   name: "Family Home",
    //   location: "Maadi",
    //   price: "$260,000",
    //   status: "Approved",
    // },
  ],

  properties: [
    // {
    //   id: 1,
    //   title: "Modern Apartment",
    //   location: "New Cairo, Egypt",
    //   price: 185000,
    //   type: "Apartment",
    //   beds: 3,
    //   baths: 2,
    //   area: "180 m²",
    //   listingType: "Buy",
    //   status: "Pending",
    //   image:
    //     "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    // },
    // {
    //   id: 2,
    //   title: "Luxury Villa",
    //   location: "Sheikh Zayed, Egypt",
    //   price: 420000,
    //   type: "Villa",
    //   beds: 5,
    //   baths: 4,
    //   area: "420 m²",
    //   listingType: "Rent",
    //   status: "Pending",
    //   image:
    //     "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=85",
    // },
    // {
    //   id: 3,
    //   title: "Cozy Family Home",
    //   location: "Maadi, Egypt",
    //   price: 260000,
    //   type: "House",
    //   beds: 4,
    //   baths: 2,
    //   area: "240 m²",
    //   listingType: "Buy",
    //   status: "Pending",
    //   image:
    //     "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    // },
  ],

  inquiry: {
    name: "",
    phone: "",
    message: "",
  },

  messages: [],

  accounts: [
    // {
    //   id: 1,
    //   name: "Ahmed Ali",
    //   email: "ahmed@gmail.com",
    //   password: "123456",
    //   role: "user",
    // },
    // {
    //   id: 2,
    //   name: "Saeed Osama",
    //   email: "z",
    //   password: "z",
    //   role: "agent",
    // },
    // {
    //   id: 3,
    //   name: "Admin",
    //   email: "a",
    //   password: "a",
    //   role: "admin",
    // },
  ],

  user: null,
  isAuthenticated: false,

  register: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  },

  login: {
    email: "",
    password: "",
  },
  actionmessages: {
    success: "",
    error: "",
    access: "",
  },
};
