import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSlideout from "@/components/cart-slideout";

export default function SizeGuide() {
  const menSizes = [
    { us: "7", uk: "6", eu: "40", cm: "25" },
    { us: "7.5", uk: "6.5", eu: "40.5", cm: "25.5" },
    { us: "8", uk: "7", eu: "41", cm: "26" },
    { us: "8.5", uk: "7.5", eu: "42", cm: "26.5" },
    { us: "9", uk: "8", eu: "42.5", cm: "27" },
    { us: "9.5", uk: "8.5", eu: "43", cm: "27.5" },
    { us: "10", uk: "9", eu: "44", cm: "28" },
    { us: "10.5", uk: "9.5", eu: "44.5", cm: "28.5" },
    { us: "11", uk: "10", eu: "45", cm: "29" },
    { us: "11.5", uk: "10.5", eu: "45.5", cm: "29.5" },
    { us: "12", uk: "11", eu: "46", cm: "30" },
    { us: "13", uk: "12", eu: "47.5", cm: "31" },
  ];

  const womenSizes = [
    { us: "5", uk: "2.5", eu: "35.5", cm: "22" },
    { us: "5.5", uk: "3", eu: "36", cm: "22.5" },
    { us: "6", uk: "3.5", eu: "36.5", cm: "23" },
    { us: "6.5", uk: "4", eu: "37.5", cm: "23.5" },
    { us: "7", uk: "4.5", eu: "38", cm: "24" },
    { us: "7.5", uk: "5", eu: "38.5", cm: "24.5" },
    { us: "8", uk: "5.5", eu: "39", cm: "25" },
    { us: "8.5", uk: "6", eu: "40", cm: "25.5" },
    { us: "9", uk: "6.5", eu: "40.5", cm: "26" },
    { us: "9.5", uk: "7", eu: "41", cm: "26.5" },
    { us: "10", uk: "7.5", eu: "42", cm: "27" },
    { us: "11", uk: "8.5", eu: "43", cm: "28" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Size Guide</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size charts. Not sure? Order two sizes and return the one that doesn't fit — free of charge.
          </p>
        </div>

        <div className="space-y-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Men's Shoe Sizes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-900">US</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">UK</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">EU</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">CM</th>
                  </tr>
                </thead>
                <tbody>
                  {menSizes.map((size) => (
                    <tr key={size.us} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{size.us}</td>
                      <td className="py-3 px-4 text-gray-700">{size.uk}</td>
                      <td className="py-3 px-4 text-gray-700">{size.eu}</td>
                      <td className="py-3 px-4 text-gray-700">{size.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Women's Shoe Sizes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-900">US</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">UK</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">EU</th>
                    <th className="py-3 px-4 font-semibold text-gray-900">CM</th>
                  </tr>
                </thead>
                <tbody>
                  {womenSizes.map((size) => (
                    <tr key={size.us} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{size.us}</td>
                      <td className="py-3 px-4 text-gray-700">{size.uk}</td>
                      <td className="py-3 px-4 text-gray-700">{size.eu}</td>
                      <td className="py-3 px-4 text-gray-700">{size.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Measure Your Feet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ol className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">1</span>
                    <span>Place a piece of paper on the floor against a wall. Stand on the paper with your heel against the wall.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">2</span>
                    <span>Mark the longest point of your foot on the paper with a pencil.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">3</span>
                    <span>Measure the distance from the wall to the mark in centimeters.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">4</span>
                    <span>Use the CM column in our size chart to find your size. If you're between sizes, we recommend going up half a size.</span>
                  </li>
                </ol>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Fitting Tips</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Measure your feet in the afternoon when they are at their largest.</li>
                  <li>• Always measure both feet — most people have one foot slightly larger than the other.</li>
                  <li>• Wear the type of socks you plan to wear with the shoes when measuring.</li>
                  <li>• Athletic shoes may run differently than dress shoes, so check brand-specific notes.</li>
                  <li>• If between sizes, consider the shoe type: go up for athletic shoes, true to size for dress shoes.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartSlideout />
    </div>
  );
}
