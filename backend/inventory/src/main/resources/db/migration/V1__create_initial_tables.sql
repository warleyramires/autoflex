CREATE TABLE  products(
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

CREATE TABLE raw_materials(
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    stock_quantity NUMERIC(10,2) NOT NULL
);

CREATE TABLE product_raw_materials(
    id SERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    raw_material_id BIGINT NOT NULL,
    quantity_required NUMERIC(10,2) NOT NULL,

    CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES products(id),
    CONSTRAINT fk_raw_material FOREIGN KEY(raw_material_id) REFERENCES raw_materials(id),

    CONSTRAINT uk_product_raw_material UNIQUE(product_id, raw_material_id)
);