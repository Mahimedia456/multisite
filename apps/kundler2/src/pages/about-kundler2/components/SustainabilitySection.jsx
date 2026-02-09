import React from "react";

const SUSTAIN_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDlHOnuUIJykuk3nUHGa7UNhQMVI_8krU-PnHmPHHGG1wF1s7zmOLh3BvocdEKMqposOOWFh1SdUGKU4tbgtGZVEOIYJPbl63dM48bdq1gTp7cnorDe0BsKjzVhFjIS7Fc8ZvWhIbEb-uxG-GivloNBlD6iy18DQBtcG9VgKYf0VZXr82w0y4gK3xf8Obbs8RxSSSnElobsy8zmXa3onpwaqxCnN_x8FYQNEsxMePZt_H3G_8ZbcM2NEJdq-Vp_JezKb-x2n6x4tNI";

export default function SustainabilitySection() {
  return (
    <section className="py-24 max-w-[1280px] mx-auto px-6 lg:px-10">
      <div className="rounded-3xl overflow-hidden relative min-h-[400px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${SUSTAIN_BG}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 to-transparent"></div>
        </div>

        <div className="relative p-10 md:p-16 max-w-2xl text-white">
          <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-4">
            Engagement
          </h2>
          <h3 className="text-4xl font-bold mb-6">Nachhaltigkeit &amp; Engagement</h3>
          <p className="text-gray-200 text-lg mb-8">
            Verantwortung endet nicht bei unseren Policen. Wir investieren in grüne Energie, fördern soziale Projekte und
            setzen uns aktiv für den Klimaschutz ein. Weil uns Ihre Zukunft am Herzen liegt.
          </p>
          <button className="bg-white text-background-dark font-bold px-8 py-3 rounded-lg hover:bg-primary transition-colors">
            Mehr erfahren
          </button>
        </div>
      </div>
    </section>
  );
}
