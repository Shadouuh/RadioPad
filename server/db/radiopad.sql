-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-10-2025 a las 00:57:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `radiopad`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `collections_sounds`
--

CREATE TABLE `collections_sounds` (
  `collection_sound_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  `sound_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `collections_sounds`
--

INSERT INTO `collections_sounds` (`collection_sound_id`, `collection_id`, `sound_id`, `added_at`) VALUES
(1, 1, 1, '2025-10-27 23:09:04'),
(3, 2, 3, '2025-10-27 23:09:04'),
(4, 3, 2, '2025-10-27 23:09:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programs`
--

CREATE TABLE `programs` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `programs`
--

INSERT INTO `programs` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Programa Matutino', 'Programa de noticias y entretenimiento matutino', 'Active', '2025-10-27 23:09:04', '2025-10-27 23:51:33'),
(4, 'Prueba', 'aaaa', 'Inactive', '2025-10-27 23:51:59', '2025-10-27 23:52:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programs_sounds`
--

CREATE TABLE `programs_sounds` (
  `program_sound_id` int(11) NOT NULL,
  `program_id` int(11) NOT NULL,
  `sound_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `programs_sounds`
--

INSERT INTO `programs_sounds` (`program_sound_id`, `program_id`, `sound_id`, `added_at`) VALUES
(1, 1, 1, '2025-10-27 23:09:04'),
(2, 1, 4, '2025-10-27 23:09:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sounds`
--

CREATE TABLE `sounds` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` float DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `file_url` varchar(500) NOT NULL,
  `program_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sounds`
--

INSERT INTO `sounds` (`id`, `name`, `description`, `duration`, `category`, `file_url`, `program_id`, `created_at`) VALUES
(2, 'Música de Fondooooooo', 'Música suave para transiciones', 45, 'Música', '', 1, '2025-10-27 23:09:04'),
(4, 'piña', 'Una piña muy fuerte', 3, 'Efectos', '', 1, '2025-10-27 23:13:23'),
(6, 'toc toc', 'ABRAM LA PUELTA, ABLAN LA MALDITA PUELTA', 3, 'Música', '', 1, '2025-10-27 23:40:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sound_categories`
--

CREATE TABLE `sound_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sound_categories`
--

INSERT INTO `sound_categories` (`category_id`, `category_name`, `description`, `created_at`) VALUES
(1, 'Efectos de ambiente', 'Sonidos ambientales como lluvia, viento, multitudes', '2025-10-27 23:09:04'),
(2, 'Jingles', 'Melodías cortas para transiciones', '2025-10-27 23:09:04'),
(3, 'Efectos especiales', 'Sonidos para momentos dramáticos o cómicos', '2025-10-27 23:09:04'),
(4, 'Música de fondo', 'Pistas musicales para usar como fondo', '2025-10-27 23:09:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sound_collections`
--

CREATE TABLE `sound_collections` (
  `collection_id` int(11) NOT NULL,
  `collection_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sound_collections`
--

INSERT INTO `sound_collections` (`collection_id`, `collection_name`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Colección matutina', 'Sonidos para el programa de la mañana', NULL, '2025-10-27 23:09:04', '2025-10-27 23:09:04'),
(2, 'Efectos dramáticos', 'Colección de efectos para momentos de tensión', NULL, '2025-10-27 23:09:04', '2025-10-27 23:09:04'),
(3, 'Ambiente natural', 'Sonidos de la naturaleza', NULL, '2025-10-27 23:09:04', '2025-10-27 23:09:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sound_effects`
--

CREATE TABLE `sound_effects` (
  `sound_id` int(11) NOT NULL,
  `sound_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `file_path` varchar(500) NOT NULL,
  `duration_seconds` float DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `is_institutional` tinyint(1) DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sound_effects`
--

INSERT INTO `sound_effects` (`sound_id`, `sound_name`, `description`, `file_path`, `duration_seconds`, `file_size`, `is_institutional`, `category_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Intro oficial', 'Introducción oficial de la radio', 'https://res.cloudinary.com/dbhly9c1j/video/upload/v1761440817/sounds/1761440815237-376919989_dg00y8.mp3', 15.5, 1024000, 1, 2, NULL, '2025-10-27 23:09:04', '2025-10-27 23:09:04'),
(2, 'Efecto de lluvia', 'Sonido de lluvia suave', 'https://res.cloudinary.com/dbhly9c1j/video/upload/v1761440817/sounds/1761440815237-376919989_dg00y8.mp3', 60, 2048000, 0, 1, NULL, '2025-10-27 23:09:04', '2025-10-27 23:09:04'),
(3, 'Risas', 'Efecto de risas para momentos cómicos', 'https://res.cloudinary.com/dbhly9c1j/video/upload/v1761440817/sounds/1761440815237-376919989_dg00y8.mp3', 3.2, 512000, 0, 3, NULL, '2025-10-27 23:09:04', '2025-10-27 23:09:04'),
(4, 'Música jazz', 'Música de fondo estilo jazz', 'https://res.cloudinary.com/dbhly9c1j/video/upload/v1761440817/sounds/1761440815237-376919989_dg00y8.mp3', 120, 4096000, 0, 4, NULL, '2025-10-27 23:09:04', '2025-10-27 23:09:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `lock_until` datetime DEFAULT NULL,
  `failed_attempts` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `role` enum('Productor','Operador','Jefe de Operadores') DEFAULT 'Productor',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `lock_until`, `failed_attempts`, `active`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Productor Test', 'productor@example.com', 'hashedpassword123', NULL, 0, 1, 'Productor', '2025-10-27 23:09:04', '2025-10-27 23:09:04');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `collections_sounds`
--
ALTER TABLE `collections_sounds`
  ADD PRIMARY KEY (`collection_sound_id`),
  ADD UNIQUE KEY `unique_collection_sound` (`collection_id`,`sound_id`),
  ADD KEY `idx_collections_sounds_collection` (`collection_id`),
  ADD KEY `idx_collections_sounds_sound` (`sound_id`);

--
-- Indices de la tabla `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `programs_sounds`
--
ALTER TABLE `programs_sounds`
  ADD PRIMARY KEY (`program_sound_id`),
  ADD UNIQUE KEY `unique_program_sound` (`program_id`,`sound_id`),
  ADD KEY `idx_programs_sounds_program` (`program_id`),
  ADD KEY `idx_programs_sounds_sound` (`sound_id`);

--
-- Indices de la tabla `sounds`
--
ALTER TABLE `sounds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indices de la tabla `sound_categories`
--
ALTER TABLE `sound_categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indices de la tabla `sound_collections`
--
ALTER TABLE `sound_collections`
  ADD PRIMARY KEY (`collection_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indices de la tabla `sound_effects`
--
ALTER TABLE `sound_effects`
  ADD PRIMARY KEY (`sound_id`),
  ADD KEY `idx_sound_effects_category` (`category_id`),
  ADD KEY `idx_sound_effects_institutional` (`is_institutional`),
  ADD KEY `idx_sound_effects_created_by` (`created_by`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `collections_sounds`
--
ALTER TABLE `collections_sounds`
  MODIFY `collection_sound_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `programs`
--
ALTER TABLE `programs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `programs_sounds`
--
ALTER TABLE `programs_sounds`
  MODIFY `program_sound_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `sounds`
--
ALTER TABLE `sounds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `sound_categories`
--
ALTER TABLE `sound_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `sound_collections`
--
ALTER TABLE `sound_collections`
  MODIFY `collection_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sound_effects`
--
ALTER TABLE `sound_effects`
  MODIFY `sound_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `collections_sounds`
--
ALTER TABLE `collections_sounds`
  ADD CONSTRAINT `collections_sounds_ibfk_1` FOREIGN KEY (`collection_id`) REFERENCES `sound_collections` (`collection_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `collections_sounds_ibfk_2` FOREIGN KEY (`sound_id`) REFERENCES `sound_effects` (`sound_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `programs_sounds`
--
ALTER TABLE `programs_sounds`
  ADD CONSTRAINT `programs_sounds_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `programs_sounds_ibfk_2` FOREIGN KEY (`sound_id`) REFERENCES `sound_effects` (`sound_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sounds`
--
ALTER TABLE `sounds`
  ADD CONSTRAINT `sounds_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sound_collections`
--
ALTER TABLE `sound_collections`
  ADD CONSTRAINT `sound_collections_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `sound_effects`
--
ALTER TABLE `sound_effects`
  ADD CONSTRAINT `sound_effects_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `sound_categories` (`category_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sound_effects_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
