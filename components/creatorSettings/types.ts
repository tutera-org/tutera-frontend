export interface CustomizationFormData {
  logo: string;
  sections: {
    section1: {
      image: string;
    };
    section2: {
      description: string;
      image: string;
    };
    section3: {
      description: string;
      image: string;
    };
    section4: {
      title: string;
      description: string;
      image: string;
    };
    section5: {
      testimonials: Array<{
        image: string;
        name: string;
        jobTitle: string;
        remark: string;
      }>;
    };
  };
}
