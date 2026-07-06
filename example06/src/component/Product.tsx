import { List, useRecordContext, Link, Datagrid, TextField, ImageField, NumberField, Create, Edit, SimpleForm, TextInput, NumberInput, ImageInput, ReferenceInput, SelectInput, EditButton, DeleteButton,RaRecord, } from 'react-admin';

import { Link as RouterLink } from 'react-router-dom';

const CustomImageField = ({ source }: { source: string }) => {
    const record = useRecordContext<RaRecord>();

    if (!record?.[source]) {
        return <span>No Image</span>;
    }

    return (
        <RouterLink
            to={`/products/${record.productId}/image`}
            style={{ display: 'inline-block' }}
        >
            <img
                src={record[source]}
                alt="Product"
                style={{
                    width: 100,
                    cursor: 'pointer',
                    border: '1px solid #444',
                }}
            />
        </RouterLink>
    );
};

export default CustomImageField;

const postFilters = [
    <TextInput source="search" label="Search" alwaysOn />,
    <ReferenceInput source="categoryId" reference="categories" label="Thể loại">    
        <SelectInput optionText="categoryName" optionValue="id" />
    </ReferenceInput>
];
export const ProductList = () => (
    <List filters={postFilters}>
        <Datagrid rowClick={false}>
            <TextField source="productId" label="Product ID" />
            <TextField source="productName" label="Product Name" />
            <TextField source="categoryName" label="Category Name" />   
            <CustomImageField source="image" />
            <TextField source="description" label="Description" />
            <NumberField source="quantity" label="Quantity" />
            <NumberField source="price" label="Price" />
            <NumberField source="discount" label="Discount" />
            <NumberField source="specialPrice" label="Special Price" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);
export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="productName" label="Product Name (Product name must contain atleast 3 characters)" />
            <TextInput source="description" label="Description (Product Description must contain atleast 6 characters)" />
            <NumberInput source="quantity" label="Quantity" />
            <NumberInput source="price" label="Price" />
            <NumberInput source="discount" label="Discount" />
            <NumberInput source="specialPrice" label="Special Price" />
            <ReferenceInput source="categoryId" reference="categories" label="Category" >
                <SelectInput optionText="categoryName" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="productId" disabled />
            <ReferenceInput source="categoryId" reference="categories" label="Category">
                <SelectInput optionText="categoryName" />
            </ReferenceInput>
            <TextInput source="productName" />
            <TextInput source="image" disabled />
            <TextInput source="description" />
            <NumberInput source="quantity" />
            <NumberInput source="price" />
            <NumberInput source="discount" />
            <NumberInput source="specialPrice" />
        </SimpleForm>
    </Edit>
);
