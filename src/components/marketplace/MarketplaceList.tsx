
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Leaf, ShoppingCart, Filter } from "lucide-react";
import { IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

// Mock data for the marketplace with prices in INR
const FARMERS = [
  {
    id: 1,
    name: "John Smith",
    location: "Iowa, USA",
    farmType: "Mixed Crop Farm",
    credits: 156,
    price: 2075, // Price in INR
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Maria Garcia",
    location: "California, USA",
    farmType: "Organic Vineyard",
    credits: 87,
    price: 2324, // Price in INR
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Raj Patel",
    location: "Gujarat, India",
    farmType: "Rice Paddy",
    credits: 210,
    price: 1826, // Price in INR
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Emma Johnson",
    location: "Ontario, Canada",
    farmType: "Dairy Farm",
    credits: 134,
    price: 2158, // Price in INR
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Liu Wei",
    location: "Sichuan, China",
    farmType: "Tea Plantation",
    credits: 175,
    price: 1992, // Price in INR
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Carlos Rodriguez",
    location: "Jalisco, Mexico",
    farmType: "Agave Farm",
    credits: 98,
    price: 2241, // Price in INR
    image: "/placeholder.svg"
  }
];

export function MarketplaceList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceSort, setPriceSort] = useState("low-to-high");
  const { t, currencySymbol } = useLanguage();
  
  // Filter and sort farmers
  const filteredFarmers = FARMERS
    .filter(farmer => 
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farmType.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (priceSort === "low-to-high") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-agro-green mb-8 text-center">
        {t("कार्बन क्रेडिट मार्केटप्लेस", "Carbon Credit Marketplace")}
      </h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Input 
            placeholder={t("किसान, स्थान, या फार्म प्रकार द्वारा खोजें...", "Search by farmer, location, or farm type...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-agro-green/60" />
        </div>
        
        <div className="w-full md:w-64">
          <Select 
            value={priceSort} 
            onValueChange={setPriceSort}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("मूल्य द्वारा क्रमबद्ध करें", "Sort by price")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low-to-high">{t("मूल्य: कम से अधिक", "Price: Low to High")}</SelectItem>
              <SelectItem value="high-to-low">{t("मूल्य: अधिक से कम", "Price: High to Low")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarmers.map(farmer => (
          <Card key={farmer.id} className="overflow-hidden border border-agro-lightGreen/20 hover:shadow-md transition-shadow">
            <CardHeader className="bg-agro-green/5 flex flex-row items-center gap-3 pb-4">
              <Avatar>
                <AvatarImage src={farmer.image} alt={farmer.name} />
                <AvatarFallback className="bg-agro-lightGreen text-white">
                  {farmer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{farmer.name}</CardTitle>
                <CardDescription>{farmer.location}</CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-3">
                <Badge variant="outline" className="flex items-center gap-1 bg-agro-cream/20 text-agro-green border-agro-cream">
                  <Leaf className="h-3 w-3" />
                  {farmer.farmType}
                </Badge>
                <span className="text-sm text-agro-green/70">
                  {t(`${farmer.credits} क्रेडिट उपलब्ध`, `${farmer.credits} credits available`)}
                </span>
              </div>
              
              <div className="flex justify-between items-baseline mt-4">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-agro-green">{currencySymbol}{farmer.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-agro-green/70 ml-1">
                    {t("प्रति क्रेडिट", "per credit")}
                  </span>
                </div>
                <div className="text-sm text-agro-green/70">
                  {t("कुल मूल्य: ", "Total value: ")} {currencySymbol}{(farmer.credits * farmer.price).toLocaleString('en-IN')}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-white pt-2 pb-4 flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-agro-green text-agro-green hover:bg-agro-green/5"
              >
                {t("विवरण", "Details")}
              </Button>
              <Button 
                className="flex-1 bg-agro-green hover:bg-agro-green/90 flex items-center justify-center gap-1"
              >
                <ShoppingCart className="h-4 w-4" />
                {t("क्रेडिट खरीदें", "Buy Credits")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
