import { Schema,model,Document } from "mongoose";

interface FaqItem extends Document{
    question : string;
    answer : string;

}

interface Category extends Document{
    title : string;
}
interface BannerImage extends Document{
    publuc_id : string;
    url : string;
}

interface Layout extends Document{
    type : string;
    faq: FaqItem[];
    categories : Category[];
    banner : {
        image : BannerImage;
        title : string;
        subtTitle : string;
    };
}

const faqSchema = new Schema<FaqItem>({
    question : {type  : String},
    answer : {type : String},
})

const CategorySchema = new Schema({
    title : {type : String},
})

const bannerImageSchema = new Schema<BannerImage>({
    publuc_id:{type:String},
    url : {type:String},
})

const LayoutSchema = new Schema<Layout>({
    type : {type : String},
    faq: [faqSchema],
    categories : [CategorySchema],
    banner:{
        image:bannerImageSchema,
        title:{type:String},
        subTitle:{type:String},
    }
})


const LayoutModel = model<Layout>('Layout',LayoutSchema);

export default LayoutModel;