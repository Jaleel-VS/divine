import type { Schema, Struct } from '@strapi/strapi';

export interface AboutValueItem extends Struct.ComponentSchema {
  collectionName: 'components_about_value_items';
  info: {
    displayName: 'Value Item';
    icon: 'star';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface TourItineraryDay extends Struct.ComponentSchema {
  collectionName: 'components_tour_itinerary_days';
  info: {
    description: 'A single day in the tour itinerary';
    displayName: 'Itinerary Day';
    icon: 'calendar';
  };
  attributes: {
    day: Schema.Attribute.Integer & Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.value-item': AboutValueItem;
      'tour.itinerary-day': TourItineraryDay;
    }
  }
}
