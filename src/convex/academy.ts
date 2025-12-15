import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const total = await ctx.db.query("courses").collect();
    if (total.length > 0) return;

    const courses = [
      {
        title: "Saffron 101: The Red Gold",
        description: "Master the fundamentals of the world's most expensive spice. Learn about its history, cultivation, and grading standards.",
        content: `Saffron, often referred to as **"Red Gold,"** is the most expensive spice in the world, derived from the flower of *Crocus sativus*, commonly known as the "saffron crocus." The vivid crimson stigma and styles, called threads, are collected and dried for use mainly as a seasoning and colouring agent in food.

## History and Origins
Saffron's history dates back more than **3,000 years**. It was first cultivated in Greece, but today, Iran produces about 90% of the world's saffron. The spice has been used for:
*   Medicinal properties
*   Dyes and pigments
*   Perfumes and fragrances

## Cultivation
The saffron crocus thrives in climates with hot, dry summers and cold winters. The flowers bloom in autumn and must be harvested by hand before sunrise to protect the delicate stigmas from direct sunlight. 

> It takes approximately **150,000 flowers** to produce just 1 kilogram of saffron, which explains its high value.

## Grading Standards
Saffron is graded based on three key factors:
1.  **Colour (Crocin):** The intensity of the red colour.
2.  **Flavour (Picrocrocin):** The bitterness and taste profile.
3.  **Aroma (Safranal):** The distinct scent.

The highest quality saffron is **"Sargol"** or **"Negin,"** which consists of only the red tips of the stigmas. Lower grades include the yellow style, which adds weight but less flavour and colour.`,
        category: "Product Knowledge",
        image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Blockchain Verification",
        description: "Understanding how we use blockchain technology to guarantee provenance and transparency in the supply chain.",
        content: `In the luxury spice market, fraud and adulteration are significant issues. **Cyber Saffron** utilizes blockchain technology to solve this by creating an immutable record of the product's journey from farm to table.

## How it Works
Each batch of saffron is assigned a unique digital identifier (token) on the blockchain at the point of harvest. As the product moves through the supply chain—from processing to packaging and shipping—each step is recorded on the blockchain. 

This data cannot be altered, ensuring complete transparency.

## Benefits for Consumers
1.  **Provenance:** You can verify exactly where your saffron was grown.
2.  **Authenticity:** The blockchain record guarantees that the product is genuine and has not been tampered with.
3.  **Quality Assurance:** Lab test results for each batch can be linked to the blockchain record, proving the quality grade.

> By scanning the QR code on your Cyber Saffron package, you can view this entire history, giving you peace of mind about the premium product you are purchasing.`,
        category: "Technology",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Agent Success Guide",
        description: "Strategies to grow your network and maximize commissions as a Cyber Saffron agent.",
        content: `Becoming a successful **Cyber Saffron** agent requires more than just selling a product; it's about building relationships and educating your network about the value of premium, verified saffron.

## Building Your Network
Start with your immediate circle—friends, family, and colleagues who appreciate fine dining and luxury products. Share your personal experience with the product. *Authenticity is key.*

## The Commission Model
Our tiered commission structure rewards high performance. As you increase your sales volume, you move up tiers:

*   **Bronze:** Entry level
*   **Silver:** Intermediate
*   **Gold:** Advanced
*   **Platinum:** Elite

You earn higher percentages on every sale as you climb. Additionally, you earn overrides on the sales of agents you recruit, creating a passive income stream.

## Marketing Tips
*   Use high-quality images of your saffron creations on social media.
*   Host tasting events to let potential customers experience the aroma and flavour.
*   Emphasize the **blockchain verification** aspect as a unique selling point that competitors lack.

Consistency and customer service are your best tools for long-term success.`,
        category: "Business",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Culinary Arts with Saffron",
        description: "Explore the culinary applications of saffron. Learn recipes and techniques.",
        content: `Saffron is a versatile spice that can elevate both sweet and savory dishes. Its distinct earthy, floral, and slightly sweet flavour profile makes it a favourite among top chefs worldwide.

## Preparation Techniques
To release the full flavour and colour of saffron, it is best to steep the threads in a small amount of warm liquid (water, milk, or broth) for at least **20 minutes** before adding it to your dish. This "blooming" process ensures even distribution.

## Classic Pairings
Saffron pairs exceptionally well with:

*   **Rice:** Risotto Milanese, Paella, Persian Jeweled Rice
*   **Seafood:** Bouillabaisse, Scallops
*   **Dairy:** Ice cream, Panna Cotta, Yogurt
*   **Poultry:** Chicken Tagine, Roast Chicken

## Storage
Keep your saffron in an **airtight container** in a cool, dark place. Light and moisture can degrade its quality over time. Properly stored, high-quality saffron can retain its potency for several years.`,
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?q=80&w=1000&auto=format&fit=crop",
      }
    ];

    for (const course of courses) {
      await ctx.db.insert("courses", course);
    }
  },
});