-- Database: imagehub
-- PostgreSQL version

-- Create database

\connect neondb;

-- Create table: usuarios
CREATE TABLE usuarios (
    dni CHAR(9) NOT NULL,
    id_cargo INTEGER NOT NULL,
    id_estadou INTEGER NOT NULL,
    username VARCHAR(40) NOT NULL,
    email VARCHAR(40) NOT NULL,
    foto_perfil TEXT,
    descp TEXT,
    fecha_creacion DATE,
    pwd TEXT NOT NULL,
    PRIMARY KEY (dni),
    CONSTRAINT nombre_usuario UNIQUE (username),
    CONSTRAINT email UNIQUE (email)
);

-- Insert data into usuarios
INSERT INTO usuarios (dni, id_cargo, id_estadou, username, email, foto_perfil, descp, fecha_creacion, pwd) VALUES
('67123341B', 1, 1, 'borrar', 'borrar@gmail.com', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746543656/test/u7sciwb9ranvy2ightpr.webp', 'asdf', '2025-05-06', '$2b$10$DVkMYABhoAHSHWMsQhZRKelZ417jY5P5UiaqZv158rj5s6.KuQOM.'),
('67123341F', 1, 1, 'fernandito', 'fernadno@gmail.com', NULL, NULL, '2025-04-17', '$2b$10$mJFoAktyWwI7QTGkXFLTW.oHsiO1xmlZuKaFeoyZVL.qU7c2WOqI6'),
('67123341K', 1, 0, 'ferAlon', 'feid@gmail.com', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746542910/test/dkiws9smnqvoxrghqc4r.webp', 'f1 driver', '2025-05-06', '$2b$10$MKDYAktAtsTbFIsSw3pNQ.O/UJX/fuAWnzDmNgyA0MEFRaCNZL3RC'),
('67123341P', 1, 0, 'jarfa', 'yes@gmai.com', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746543385/test/jqju4ufheewgqgc6lpub.webp', 'jarfaiter', '2025-05-06', '$2b$10$nIcZNUMMy2MNF65UcEC3Bu1efuoRYcfBkmZM8fTfo6TrpdzAPNT6C'),
('67123341R', 1, 1, 'hectorCamel', 'hectorCamel@gmail.com', NULL, NULL, '2025-04-17', '$2b$10$N11HV1sLYyww2I5X4/OMlePC9b7BqEnH9tqMPHLAGnQcvxdda.s0q'),
('71317778E', 1, 0, 'alex115', 'alex115@gmail.com', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188634/test/vldqcwxqxxi10z8pxrh8.webp', 'admin115', '2025-04-16', '$2b$10$PVgZAjn3hbAAEDUQMxA0NORmoi9hUpUigaqRbwjPN7s3VhJUUihji'),
('90123341R', 1, 1, 'feid', 'feid12@gmail.com', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746721309/test/y6qgchlcnhxv9cqa8apq.webp', 'feid', '2025-05-08', '$2b$10$yBFFxmkhPJbjMJfer.fTSeRfbovIDffp0Q7T7kucp04yqFyN5z/lq');

-- Create table: publicaciones
CREATE TABLE publicaciones (
    id SERIAL NOT NULL,
    persona_dni CHAR(9),
    title VARCHAR(20) NOT NULL,
    foto TEXT NOT NULL,
    descp TEXT,
    fecha_creacion DATE,
    public_id TEXT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT publicaciones_fk_1 FOREIGN KEY (persona_dni) 
        REFERENCES usuarios (dni) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Insert data into publicaciones
INSERT INTO publicaciones (id, persona_dni, title, foto, descp, fecha_creacion, public_id) VALUES
(4, '71317778E', 'Mercedes e55 negro', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775446/test/twqpxga3guyrrcx3wpxv.webp', 'Una maravilla', '2025-04-27', 'test/twqpxga3guyrrcx3wpxv'),
(5, '71317778E', 'Merc e55 amg grey', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775474/test/bfvmtrzaycynm5c29tci.webp', 'The best car in the world', '2025-04-27', 'test/bfvmtrzaycynm5c29tci'),
(6, '71317778E', 'Nissan skyline', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775540/test/muxdpzlvppaiszbkqaqf.webp', 'r34', '2025-04-27', 'test/muxdpzlvppaiszbkqaqf'),
(14, '71317778E', 'castle', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746022186/test/yftqajiswvxsbktev20w.webp', 'castle', '2025-04-30', 'test/yftqajiswvxsbktev20w'),
(15, '71317778E', '911', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188770/test/ghnt7nkmhjajzqic5cwt.webp', '911', '2025-05-02', 'test/ghnt7nkmhjajzqic5cwt'),
(17, '71317778E', '9112', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188811/test/oqcaww70ztfd7ve2ys9c.webp', '9913', '2025-05-02', 'test/oqcaww70ztfd7ve2ys9c'),
(18, '71317778E', 'bmw', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188881/test/e78d2adz6igtd0yqtv9j.webp', 'bmw', '2025-05-02', 'test/e78d2adz6igtd0yqtv9j'),
(19, '71317778E', 'Mercedes e55 negro', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775446/test/twqpxga3guyrrcx3wpxv.webp', 'Una maravilla', '2025-04-27', 'test/twqpxga3guyrrcx3wpxv'),
(20, '71317778E', 'Merc e55 amg grey', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775474/test/bfvmtrzaycynm5c29tci.webp', 'The best car in the world', '2025-04-27', 'test/bfvmtrzaycynm5c29tci'),
(21, '71317778E', 'Nissan skyline', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775540/test/muxdpzlvppaiszbkqaqf.webp', 'r34', '2025-04-27', 'test/muxdpzlvppaiszbkqaqf'),
(22, '71317778E', 'castle', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746022186/test/yftqajiswvxsbktev20w.webp', 'castle', '2025-04-30', 'test/yftqajiswvxsbktev20w'),
(23, '71317778E', '911', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188770/test/ghnt7nkmhjajzqic5cwt.webp', '911', '2025-05-02', 'test/ghnt7nkmhjajzqic5cwt'),
(25, '71317778E', 'bmw', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188881/test/e78d2adz6igtd0yqtv9j.webp', 'bmw', '2025-05-02', 'test/e78d2adz6igtd0yqtv9j'),
(26, '71317778E', 'Mercedes e55 negro', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775446/test/twqpxga3guyrrcx3wpxv.webp', 'Una maravilla', '2025-04-27', 'test/twqpxga3guyrrcx3wpxv'),
(27, '71317778E', 'Merc e55 amg grey', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775474/test/bfvmtrzaycynm5c29tci.webp', 'The best car in the world', '2025-04-27', 'test/bfvmtrzaycynm5c29tci'),
(28, '71317778E', 'Nissan skyline', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775540/test/muxdpzlvppaiszbkqaqf.webp', 'r34', '2025-04-27', 'test/muxdpzlvppaiszbkqaqf'),
(29, '71317778E', 'castle', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746022186/test/yftqajiswvxsbktev20w.webp', 'castle', '2025-04-30', 'test/yftqajiswvxsbktev20w'),
(30, '71317778E', '911', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188770/test/ghnt7nkmhjajzqic5cwt.webp', '911', '2025-05-02', 'test/ghnt7nkmhjajzqic5cwt'),
(31, '71317778E', '9112', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188811/test/oqcaww70ztfd7ve2ys9c.webp', '9913', '2025-05-02', 'test/oqcaww70ztfd7ve2ys9c'),
(32, '71317778E', 'bmw', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188881/test/e78d2adz6igtd0yqtv9j.webp', 'bmw', '2025-05-02', 'test/e78d2adz6igtd0yqtv9j'),
(33, '71317778E', 'Mercedes e55 negro', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775446/test/twqpxga3guyrrcx3wpxv.webp', 'Una maravilla', '2025-04-27', 'test/twqpxga3guyrrcx3wpxv'),
(34, '71317778E', 'Merc e55 amg grey', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775474/test/bfvmtrzaycynm5c29tci.webp', 'The best car in the world', '2025-04-27', 'test/bfvmtrzaycynm5c29tci'),
(35, '71317778E', 'Nissan skyline', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1745775540/test/muxdpzlvppaiszbkqaqf.webp', 'r34', '2025-04-27', 'test/muxdpzlvppaiszbkqaqf'),
(36, '71317778E', 'castle', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746022186/test/yftqajiswvxsbktev20w.webp', 'castle', '2025-04-30', 'test/yftqajiswvxsbktev20w'),
(37, '71317778E', '911', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188770/test/ghnt7nkmhjajzqic5cwt.webp', '911', '2025-05-02', 'test/ghnt7nkmhjajzqic5cwt'),
(38, '71317778E', '9112', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188811/test/oqcaww70ztfd7ve2ys9c.webp', '9913', '2025-05-02', 'test/oqcaww70ztfd7ve2ys9c'),
(39, '71317778E', 'bmw', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746188881/test/e78d2adz6igtd0yqtv9j.webp', 'bmw', '2025-05-02', 'test/e78d2adz6igtd0yqtv9j'),
(41, '67123341K', '2005', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746542957/test/whiwukr5yhdt0m0zmpke.webp', 'renault', '2025-05-06', 'test/whiwukr5yhdt0m0zmpke'),
(42, '67123341K', '2024', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746543003/test/rbxiqyg5dnzeddpagtk1.webp', 'aston martin', '2025-05-06', 'test/rbxiqyg5dnzeddpagtk1'),
(46, '90123341R', 'dsf', 'https://res.cloudinary.com/dzd8rj08f/image/upload/v1746721966/test/q3oqinl170qw0hpiysze.webp', 'sdf', '2025-05-08', 'test/q3oqinl170qw0hpiysze');

-- Set sequence value for publicaciones.id
SELECT setval('publicaciones_id_seq', 47, false);

-- Create table: amigos
CREATE TABLE amigos (
    dni_persona1 CHAR(9) NOT NULL,
    dni_persona2 CHAR(9) NOT NULL,
    fecha_seguimiento DATE,
    PRIMARY KEY (dni_persona1, dni_persona2),
    CONSTRAINT amigos_fk_1 FOREIGN KEY (dni_persona1) 
        REFERENCES usuarios (dni) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT amigos_fk_2 FOREIGN KEY (dni_persona2) 
        REFERENCES usuarios (dni) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Insert data into amigos
INSERT INTO amigos (dni_persona1, dni_persona2, fecha_seguimiento) VALUES
('67123341B', '67123341K', '2025-05-08'),
('67123341K', '71317778E', '2025-05-07'),
('67123341K', '90123341R', '2025-05-08'),
('71317778E', '67123341B', '2025-05-08');

-- Create table: comentarios
CREATE TABLE comentarios (
    dni_persona CHAR(9) NOT NULL,
    id_publi INTEGER NOT NULL,
    comentario TEXT NOT NULL,
    fecha_creacion DATE,
    PRIMARY KEY (dni_persona, id_publi),
    CONSTRAINT comentarios_fk_1 FOREIGN KEY (dni_persona) 
        REFERENCES usuarios (dni) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT comentarios_fk_2 FOREIGN KEY (id_publi) 
        REFERENCES publicaciones (id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Insert data into comentarios
INSERT INTO comentarios (dni_persona, id_publi, comentario, fecha_creacion) VALUES
('67123341K', 4, 'slow as a aston martin', '2025-05-08'),
('67123341K', 41, 'yeah a nice car', '2025-05-06'),
('67123341K', 42, 'omg???', '2025-05-08'),
('71317778E', 4, 'v8 power', '2025-05-05'),
('71317778E', 18, 'e46 33', '2025-05-07'),
('71317778E', 41, 'r25 amazing¿¿', '2025-05-06'),
('90123341R', 4, 'nice merc', '2025-05-08');

-- Create table: darlike
CREATE TABLE darlike (
    dni_persona CHAR(9) NOT NULL,
    id_publi INTEGER NOT NULL,
    PRIMARY KEY (dni_persona, id_publi),
    CONSTRAINT darlike_fk_1 FOREIGN KEY (dni_persona) 
        REFERENCES usuarios (dni) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT darlike_fk_2 FOREIGN KEY (id_publi) 
        REFERENCES publicaciones (id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Insert data into darlike
INSERT INTO darlike (dni_persona, id_publi) VALUES
('67123341K', 4),
('71317778E', 4),
('71317778E', 5),
('67123341K', 41),
('71317778E', 41),
('90123341R', 41),
('71317778E', 42),
('71317778E', 46);

-- Create table: peticiones
CREATE TABLE peticiones (
    dni_persona1 CHAR(9) NOT NULL,
    dni_persona2 CHAR(9) NOT NULL,
    PRIMARY KEY (dni_persona1, dni_persona2),
    CONSTRAINT peticiones_fk_1 FOREIGN KEY (dni_persona1) 
        REFERENCES usuarios (dni) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT peticiones_fk_2 FOREIGN KEY (dni_persona2) 
        REFERENCES usuarios (dni) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- No data to insert into peticiones