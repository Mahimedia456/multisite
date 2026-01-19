export default function SplitHero() {
  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex">
        <div
          className="w-1/2 h-full bg-cover bg-center filter grayscale contrast-125 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwiW1RpQqledXKouTY1zTx8UdBFyZe3-DKlgpkJz9fXXcicD3jwWWkweQD8slo_hRPgAQViOSXtOALPzOd2I_3P9bnbjtDDPnraiCOUH8BSMlNXClUnA_O4c_J_pZbDwsdVub9jETz6A4TIybbnrG8pQuvVF6YRne0my-3cF4hs3LTNxwJ6kpMtSUU7pY0HLQVoHCRufkQ0k7ayMH63144qqEnKVGzXGV2nDF74cgjxf8TRARATUdEbV_XB9p-UFAYX4H1aLAOjv0")',
          }}
        />
        <div
          className="w-1/2 h-full bg-cover bg-center filter grayscale contrast-125 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDExZFABokCs-BX4e8eTyPiod68jlU7vHN0w6DL2VkL7XMgrC_0_u0j0Qn8hliirFA9ILncyT50AxNRHfv0dU012AakEuc5bnoPCGLaPGOsgkAfhkzyKMKZyc8dM-oslV69pHC0zzkXyRG1gi4zla9VhgWD3kvl5MqfEYw98U_ulN_iaSB6Mfw-KHAfNBm6tCUjxKYRwfuP8uG7xMpyH2n0FPn2XMSgInNST1fg1WKHwKGmbI2C8h0-iSLP1to4IXO3UKXsWDXvIMU")',
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/50 to-background-light dark:via-background-dark/50 dark:to-background-dark" />

      <div className="relative z-10 max-w-[800px] text-center px-6">
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight mb-6">
          One Vision.
          <br />
          Two specialized protections.
        </h1>
        <p className="text-lg md:text-xl text-[#665a73] dark:text-[#a195ad] max-w-[600px] mx-auto leading-relaxed">
          Premium protection tailored for what matters most. Choose your dedicated coverage path with our
          industry-leading brands.
        </p>
      </div>
    </section>
  );
}
