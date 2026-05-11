export const HOW_TO_USE_MEDIA = [
  {
    moduleKey: "dashboard",
    title: "Dashboard",
    images: [
      {
        label: "Dashboard Sidebar",
        url: "/how-to-use-media/dashboard/step-1.png",
      },
      {
        label: "Dashboard Cards",
        url: "/how-to-use-media/dashboard/step-2.png",
      },
      {
        label: "Dashboard Activity",
        url: "/how-to-use-media/dashboard/step-3.png",
      },
    ],
  },
  {
    moduleKey: "brands",
    title: "Brands",
    images: [
      {
        label: "Brands List",
        url: "/how-to-use-media/brands/step-1.png",
      },
      {
        label: "Brand Detail",
        url: "/how-to-use-media/brands/step-2.png",
      },
      {
        label: "Company Details",
        url: "/how-to-use-media/brands/company-details.png",
      },
    ],
  },
  {
    moduleKey: "brand_inner_pages",
    title: "Brand Inner Pages",
    images: [
      {
        label: "Inner Pages List",
        url: "/how-to-use-media/brand-inner-pages/step-1.png",
      },
      {
        label: "Inner Page Editor",
        url: "/how-to-use-media/brand-inner-pages/step-2.png",
      },
    ],
  },
  {
    moduleKey: "brand_unique_pages",
    title: "Brand Unique Pages",
    images: [
      {
        label: "Unique Pages Brands",
        url: "/how-to-use-media/brand-unique-pages/step-1.png",
      },
      {
        label: "Unique Pages List",
        url: "/how-to-use-media/brand-unique-pages/step-2.png",
      },
      {
        label: "Unique Page Builder",
        url: "/how-to-use-media/brand-unique-pages/builder.png",
      },
    ],
  },
  {
    moduleKey: "support_chat",
    title: "Support Chat",
    images: [
      {
        label: "Support Threads",
        url: "/how-to-use-media/support-chat/step-1.png",
      },
      {
        label: "Support Conversation",
        url: "/how-to-use-media/support-chat/step-2.png",
      },
    ],
  },
  {
    moduleKey: "blogs",
    title: "Blogs",
    images: [
      {
        label: "Blogs List",
        url: "/how-to-use-media/blogs/step-1.png",
      },
      {
        label: "Blog Editor",
        url: "/how-to-use-media/blogs/step-2.png",
      },
    ],
  },
  {
    moduleKey: "blog_categories",
    title: "Blog Categories",
    images: [
      {
        label: "Blog Categories List",
        url: "/how-to-use-media/blog-categories/step-1.png",
      },
      {
        label: "Blog Category Form",
        url: "/how-to-use-media/blog-categories/step-2.png",
      },
    ],
  },
  {
    moduleKey: "settings",
    title: "Settings",
    images: [
      {
        label: "Settings Index",
        url: "/how-to-use-media/settings/step-1.png",
      },
    ],
  },
  {
    moduleKey: "module_settings",
    title: "Module Settings",
    images: [
      {
        label: "Module Settings Brands",
        url: "/how-to-use-media/module-settings/step-1.png",
      },
      {
        label: "Module Permissions",
        url: "/how-to-use-media/module-settings/step-2.png",
      },
    ],
  },
  {
    moduleKey: "website_settings",
    title: "Website Settings",
    images: [
      {
        label: "Website Settings Brands",
        url: "/how-to-use-media/website-settings/step-1.png",
      },
      {
        label: "Website Page Visibility",
        url: "/how-to-use-media/website-settings/step-2.png",
      },
    ],
  },
  {
    moduleKey: "admin_settings",
    title: "Admin Settings",
    images: [
      {
        label: "Admin Settings List",
        url: "/how-to-use-media/admin-settings/step-1.png",
      },
      {
        label: "Admin Permissions",
        url: "/how-to-use-media/admin-settings/step-2.png",
      },
    ],
  },
];

export function getHowToUseMediaByModule(moduleKey) {
  return HOW_TO_USE_MEDIA.find((group) => group.moduleKey === moduleKey) || null;
}

export function getAllHowToUseMedia() {
  return HOW_TO_USE_MEDIA.flatMap((group) =>
    group.images.map((image, index) => ({
      ...image,
      stepIndex: index,
      moduleKey: group.moduleKey,
      moduleTitle: group.title,
    }))
  );
}

export function getDefaultStepsFromMedia(moduleKey) {
  const group = getHowToUseMediaByModule(moduleKey);

  if (!group?.images?.length) {
    return [
      {
        title: "",
        text: "",
        image_url: "",
        caption: "",
        images: [],
      },
    ];
  }

  return group.images.map((image) => ({
    title: image.label || "",
    text: "",
    image_url: image.url || "",
    caption: image.label || "",
    images: [
      {
        url: image.url || "",
        caption: image.label || "",
      },
    ],
  }));
}