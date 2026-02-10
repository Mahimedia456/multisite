export default function Preisbeispiele({
  title = "Preisbeispiele",
  subtitle = "So günstig kann Ihr Versicherungsschutz sein.",
  items = [
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrlg8YpsJYDuYiHiGtcRhb0TX9EXSdLaC2CbXyfOSE-lJ2xgxRv5pFWdAeVCprA4GOu3gbrx5Qvwl15QQ2o46cyDgST79CTxV-8bjdhEqYXZD634X7qY5tvjGYGAvKBblrN0EPQY34BLX3wJQuA1aQnN18JS8fL5m7mtc9LgxoAgobtRCwdBlGg06ozzu3zYcYTJrM7u2MyAZ0-iJnsbJr4XHJUA3pV549wzYwZUx4oB4fnVDE1wzheTxo0mjS5kPbhWCp_g8BOH0",
      title: "Fiat 500",
      meta: "1.2 Lounge, 69 PS",
      price: "12,50 €",
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDk3t0-vZTGIGi1PkuHQszIiS5ULtZHsV9v9QDaJCT8SjcUtcSIqMeEG3fUHvs7Cb4HhmEnjthvNJcPwgYxSCA-GO6d0HuIozYaYLYADr3YOo3vnU1e0M8UO6sFq7Y0rPqNnq0AEdhQ-mJRQgEj_J7p5r0LLjItHq-UxoON_zvDKnNpizjEdYy-aeqJIoxgWCRsHe3bGs_FMaAVMHvVJTdVZ-SpRtk5gXaPIkJw3lnWi4xsX7krlNFDshePwe4YIe3DPCLvyiyI6M",
      title: "Mercedes A-Klasse",
      meta: "A 180, 136 PS",
      price: "18,90 €",
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbySbh2N6r5VzIn8sNuwugbbD_kxSPUJyE1QmndiUYCGstLbkqEP0PQFEdEm2ZWZZ2BWIbGvd0vfKdjq55Oa6Wi9o0cZFXkzcU7LxtvVAsYCM9VGvou71rT36jEd0frXuFhFvb_oTbhX2LJefWh3zlIbP4J5erYLOihckUqV3KynJqOIKz4Z2QIyqQv-3ormggUZkTPozwEYcMRD-2-8PvzmCTQ9DUh4Iw3R-Gqu_XvjyckWPI_RbBkE3xk10CNaUFMns07C75WSk",
      title: "BMW 3er",
      meta: "320d, 190 PS",
      price: "24,30 €",
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoC_CKV_z02oGSED7cy57l2RY9nPioE2q_Niwqc3Zp9GJxNd8pmZ7R_l_lFq9BQjPNmaN_VbHRSjPuToMnIHdRclvY2AY-riENcZ8U53zH7ay2BjAm82a-TTv0vIAh2gyXD0c6A2db2zjkNqi9L3rRkanefSOyASKkf8-zfiyU5jEaQDKaweeuhq4kDkbRYERcTf3v5s10oflI8shvrz65POmiMMtAUexVpgzSq42-ETwlz8qKEpJ1FE6RvxXZV4S1gA2ViTbAUOM",
      title: "Dacia Spring",
      meta: "Electric 45, 44 PS",
      price: "9,80 €",
    }
  ]
}) {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-slate-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <img className="w-full h-32 object-contain mb-4" src={it.img} alt={it.title} />
              <h5 className="font-bold text-center">{it.title}</h5>
              <p className="text-xs text-center text-slate-500 mb-4">{it.meta}</p>
              <div className="text-2xl font-black text-primary text-center">
                {it.price} <span className="text-xs font-normal text-slate-400">/ mtl.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
