export default {
    populate: {
        contentSections: {
            on: {
                'sections.image-sliders': {
                    populate: {
                        'sliders': {
                            populate: { image: true },
                        }
                    }
                },
                'sections.hero': {
                    populate: '*'
                }
            }
             
        },
        seo: {
            fields: ["metaTitle", "metaDescription"],
            populate: { shareImage: true },
        }
    }
}