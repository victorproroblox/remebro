-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: edumochila
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias` (
  `id_cat` int(11) NOT NULL AUTO_INCREMENT,
  `nom_cat` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_cat`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Primaria');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_07_22_175049_create_personal_access_tokens_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\Usuarios',8,'auth_token','97dfa42352fc5ccbede53d11071b956c7abe6ffdf44d191f7ac85160d5bc383c','[\"*\"]',NULL,NULL,'2025-07-23 00:17:09','2025-07-23 00:17:09'),(2,'App\\Models\\Usuarios',8,'auth_token','c610f83e242e3addcee9bcd790d14ccb5af0e2f089e7e508c2653d422b2d424e','[\"*\"]',NULL,NULL,'2025-07-23 00:19:13','2025-07-23 00:19:13'),(3,'App\\Models\\Usuarios',8,'auth_token','123ed95a1822f959274a2389556fdb7bd558d7f0f248f1537ac2f1722271487c','[\"*\"]',NULL,NULL,'2025-07-23 00:30:23','2025-07-23 00:30:23'),(4,'App\\Models\\Usuarios',8,'auth_token','ee0bd44c1734dbfe1acf2b8a2540df8487780e130f0b10bb9278e2af447ea0f2','[\"*\"]',NULL,NULL,'2025-07-23 00:30:38','2025-07-23 00:30:38'),(5,'App\\Models\\Usuarios',8,'auth_token','5b8d6cb0f94625ab46ca53dc075b6c5c63f2d9380ca7fbab9255f49251350bb8','[\"*\"]',NULL,NULL,'2025-07-23 00:38:30','2025-07-23 00:38:30'),(6,'App\\Models\\Usuarios',8,'auth_token','72e2dca0bc9db9ded3acc0abab52b1edeb2294524be6ca862ee890c388469370','[\"*\"]',NULL,NULL,'2025-07-23 00:39:32','2025-07-23 00:39:32'),(7,'App\\Models\\Usuarios',8,'auth_token','3e77ad44b5a3c407cffd71f2a0b72826f7e7b320b053553ba15fcc3062ed3a08','[\"*\"]',NULL,NULL,'2025-07-23 00:42:12','2025-07-23 00:42:12'),(8,'App\\Models\\Usuarios',8,'auth_token','b3359588f555fe744181665ee12d4ad13af8ae98db6ef300ada212ef2fa57b39','[\"*\"]',NULL,NULL,'2025-07-23 00:45:16','2025-07-23 00:45:16'),(9,'App\\Models\\Usuarios',8,'auth_token','d81c486cf65554c7a4a43d97e4ad4552d4bff4b810d5f78fe4432ad23b2cf16b','[\"*\"]',NULL,NULL,'2025-07-23 00:53:34','2025-07-23 00:53:34'),(10,'App\\Models\\Usuarios',12,'auth_token','577d6f89c0a9fbdd982f0f79d739d88fa7bff9e61cb0a4054bc79805557175b2','[\"*\"]',NULL,NULL,'2025-07-23 01:10:45','2025-07-23 01:10:45'),(11,'App\\Models\\Usuarios',13,'auth_token','5670a0efb9ffe66d790e351fa9f07a444683c998fb202409c8277d389d4016b3','[\"*\"]',NULL,NULL,'2025-07-23 01:13:48','2025-07-23 01:13:48'),(12,'App\\Models\\Usuarios',12,'auth_token','1d095c80873fe880cca3d2ed8cf7b4bfe11f8d7a323a20c28cf14db3cdf0e2c8','[\"*\"]',NULL,NULL,'2025-07-23 01:13:59','2025-07-23 01:13:59'),(13,'App\\Models\\Usuarios',8,'auth_token','6d106825419adaadcfc636302fdaef582c8fd7af3f2a1d63ab00851a3fc19fe7','[\"*\"]',NULL,NULL,'2025-07-23 01:27:52','2025-07-23 01:27:52'),(14,'App\\Models\\Usuarios',7,'auth_token','828dfcbe81c51ba656f1765ab96cccb03b264e7bbb8be8eae1c1335b9f5df103','[\"*\"]',NULL,NULL,'2025-07-23 01:28:15','2025-07-23 01:28:15'),(15,'App\\Models\\Usuarios',8,'auth_token','cd17037368971963181d4fbe8b84962ae99273d566cba0ddea0e3e5efd857bf6','[\"*\"]',NULL,NULL,'2025-07-23 01:29:50','2025-07-23 01:29:50'),(16,'App\\Models\\Usuarios',8,'auth_token','76f131b0b3f7fb672c9526d11f2b77de96ab72b2b490297699aec980faba0f49','[\"*\"]',NULL,NULL,'2025-07-23 01:35:26','2025-07-23 01:35:26'),(17,'App\\Models\\Usuarios',8,'auth_token','098f5309c8b183fcd40f223ae87050c0a0cc9e1fbe1c1cf17870f7edb6722ba7','[\"*\"]',NULL,NULL,'2025-07-23 21:45:17','2025-07-23 21:45:17'),(18,'App\\Models\\Usuarios',8,'auth_token','78b2a6c320a6f47c1d4a7dd2d268e4bca8379c8599a78f85174a882fc9741245','[\"*\"]',NULL,NULL,'2025-08-05 06:04:31','2025-08-05 06:04:31'),(19,'App\\Models\\Usuarios',8,'auth_token','3d1d286572216240a6a25861a3ae1bcd782ff366dc1eb547acce44cee29acb8f','[\"*\"]',NULL,NULL,'2025-08-05 06:16:38','2025-08-05 06:16:38'),(20,'App\\Models\\Usuarios',8,'auth_token','67477b41745252efe7ff1336dc0acb683ea5087c64329ff02f78000ae2addf3c','[\"*\"]',NULL,NULL,'2025-08-05 09:52:38','2025-08-05 09:52:38'),(21,'App\\Models\\Usuarios',8,'auth_token','90350d622a8d3a2485680284420dac2c3cf7786dbe9ba4b87bc82fb448897bce','[\"*\"]',NULL,NULL,'2025-08-05 10:14:58','2025-08-05 10:14:58'),(22,'App\\Models\\Usuarios',8,'auth_token','b2f31ce9ef4bcd3bd9f9c1ff0a4f6fd90ca4a3ce3e99b5f03e3e9850ec9cc5c9','[\"*\"]','2025-08-05 10:21:56',NULL,'2025-08-05 10:21:30','2025-08-05 10:21:56'),(23,'App\\Models\\Usuarios',2,'auth_token','ad4c47125771d295f3419ef861c6b5a99e41e0eb56deaf59987e9483f6229dbc','[\"*\"]','2025-08-05 10:22:40',NULL,'2025-08-05 10:22:39','2025-08-05 10:22:40'),(24,'App\\Models\\Usuarios',8,'auth_token','ded25db273083a00dc8353dd8311bb577cd1d2f47254ebe0ac5a23ea91a6ea92','[\"*\"]','2025-08-05 10:22:54',NULL,'2025-08-05 10:22:52','2025-08-05 10:22:54'),(25,'App\\Models\\Usuarios',8,'auth_token','cdeca350c51b9466a91439a07dc41e1d1a359084ff7b24c4779ac9fd5c813a45','[\"*\"]','2025-08-05 10:38:58',NULL,'2025-08-05 10:35:37','2025-08-05 10:38:58'),(26,'App\\Models\\Usuarios',8,'auth_token','c3cff8de95454a6d32f46cc869478ae65666daecb9911ca1df983ca0acb38bcf','[\"*\"]',NULL,NULL,'2025-08-05 13:14:55','2025-08-05 13:14:55'),(27,'App\\Models\\Usuarios',8,'auth_token','3c3d8fc1b6e81e483bd5d2c044528c35de50dccbac3a2f503da762f382c213f5','[\"*\"]',NULL,NULL,'2025-08-05 13:23:36','2025-08-05 13:23:36'),(28,'App\\Models\\Usuarios',8,'auth_token','9e3299251f6e4cc6fe9f445e54e3a5bbcc0b3648fd997cd427478912cda9fa9f','[\"*\"]','2025-08-05 19:24:41',NULL,'2025-08-05 19:21:24','2025-08-05 19:24:41'),(29,'App\\Models\\Usuarios',8,'auth_token','5548344470278a5630678e871ee6c58230cdbfb8ddad4d61022082aac2017334','[\"*\"]',NULL,NULL,'2025-08-05 19:26:07','2025-08-05 19:26:07'),(30,'App\\Models\\Usuarios',8,'auth_token','29a68c72412cbef84dfc3e78b1a9c76c692f4a60c6ac450afdf48143e10d7bf5','[\"*\"]','2025-08-05 19:28:23',NULL,'2025-08-05 19:27:11','2025-08-05 19:28:23'),(31,'App\\Models\\Usuarios',8,'auth_token','2aa00854fcfcfa8ef3cd13e7dfcd12d1642e0639c488d5d8153956bb341ffeed','[\"*\"]',NULL,NULL,'2025-08-05 19:28:46','2025-08-05 19:28:46'),(32,'App\\Models\\Usuarios',8,'auth_token','8dad75240747417dbcf849fdcb3c1355504710e8b3b5202159a7b901e5d42aea','[\"*\"]','2025-08-05 21:25:42',NULL,'2025-08-05 21:16:01','2025-08-05 21:25:42'),(33,'App\\Models\\Usuarios',8,'auth_token','6bda6e8e10f74b1a80e05a59dd6d581ebaaa2a3d49ec93806aef1aa0c4f47ebc','[\"*\"]',NULL,NULL,'2025-08-05 21:49:34','2025-08-05 21:49:34'),(34,'App\\Models\\Usuarios',8,'auth_token','c3475288a88affde5e227155d2ae69093d204f01fbde294f0fc3688fbc766845','[\"*\"]',NULL,NULL,'2025-08-05 21:54:57','2025-08-05 21:54:57'),(35,'App\\Models\\Usuarios',8,'auth_token','c04d663c5936dc201188242e99275a0e004e79913bcb35152411aafe950945da','[\"*\"]','2025-08-05 22:27:23',NULL,'2025-08-05 22:27:20','2025-08-05 22:27:23'),(36,'App\\Models\\Usuarios',8,'auth_token','e5ee7e710180f88c47ff2a9ec82b544bedd47d428350ceaec871c9a5e1b0f995','[\"*\"]','2025-08-05 22:40:04',NULL,'2025-08-05 22:39:02','2025-08-05 22:40:04'),(37,'App\\Models\\Usuarios',8,'auth_token','b8cbc5ae0db94c5894ddf8886f62582838ef360a49753cb8fd934733ec1b6e4c','[\"*\"]','2025-08-07 10:16:31',NULL,'2025-08-07 10:16:23','2025-08-07 10:16:31'),(38,'App\\Models\\Usuarios',8,'auth_token','0c43b3f1eff520a2d9ef0da2cfdf9e5326b1a7f0bc698a3f2d4a798efb897b99','[\"*\"]','2025-08-07 10:20:28',NULL,'2025-08-07 10:20:26','2025-08-07 10:20:28'),(39,'App\\Models\\Usuarios',8,'auth_token','cfb55154279a553a4df12e8c60c3f0fe61217c2f60df95aac4759718e282439f','[\"*\"]',NULL,NULL,'2025-08-08 09:30:28','2025-08-08 09:30:28'),(40,'App\\Models\\Usuarios',7,'auth_token','1fdf713fb85d40f2c2f4d13896efb5aeeb7dd611eb608cf24fcce78b48395eec','[\"*\"]',NULL,NULL,'2025-08-08 09:33:42','2025-08-08 09:33:42'),(41,'App\\Models\\Usuarios',7,'auth_token','a0b6e01e1aa90a614e31920f79b4d2d1c06b10956eb765232893ce338d3bf366','[\"*\"]',NULL,NULL,'2025-08-08 09:33:43','2025-08-08 09:33:43'),(42,'App\\Models\\Usuarios',8,'auth_token','9b8f2411719cf11d55092dc4a874cc565cdc109b8c638884d141e08e16b79b32','[\"*\"]','2025-08-11 10:29:03',NULL,'2025-08-11 10:26:46','2025-08-11 10:29:03'),(43,'App\\Models\\Usuarios',7,'auth_token','8cf0962173fcbf70c0585f0bf5b74fa213d12324de2322550f5de0152067fdf2','[\"*\"]',NULL,NULL,'2025-08-11 10:41:29','2025-08-11 10:41:29'),(44,'App\\Models\\Usuarios',7,'auth_token','16e1a224de9f953d958e0963d3b9cc25818755bf1d98ba2e20be37b47ac01f02','[\"*\"]',NULL,NULL,'2025-08-12 05:08:35','2025-08-12 05:08:35'),(45,'App\\Models\\Usuarios',7,'auth_token','2b41ffdb4d085955f05cc215d0bc95c3801200b6a6e602dfc7e1a7e19d6ef3f6','[\"*\"]',NULL,NULL,'2025-08-12 05:37:37','2025-08-12 05:37:37'),(46,'App\\Models\\Usuarios',7,'auth_token','e3ce6a33e8aea84fff786f6a2dbc9a92a45356ce5e6f28999b3fde1359553ee8','[\"*\"]',NULL,NULL,'2025-08-12 05:51:46','2025-08-12 05:51:46'),(47,'App\\Models\\Usuarios',7,'auth_token','19759731088ad6e7af6cb1840e7312f2839bec977d2338fed7b7f218c774f8e5','[\"*\"]',NULL,NULL,'2025-08-12 05:54:22','2025-08-12 05:54:22'),(48,'App\\Models\\Usuarios',2,'auth_token','98e6ea7d997c6997ce9e1023035ded671a9d09b59d18a0e150d0e4c553e42d51','[\"*\"]',NULL,NULL,'2025-08-12 08:53:47','2025-08-12 08:53:47'),(49,'App\\Models\\Usuarios',2,'auth_token','f3133dea0bfd0543053b02c069fda2cae5b41465be5bd99ceee1bcdf5629ea0c','[\"*\"]',NULL,NULL,'2025-08-12 08:53:49','2025-08-12 08:53:49'),(50,'App\\Models\\Usuarios',2,'auth_token','424e4a19d0c251851073b9b9fe73150ebac61da9e76a323e0c53c0d0cdb96fbd','[\"*\"]',NULL,NULL,'2025-08-12 08:55:23','2025-08-12 08:55:23'),(51,'App\\Models\\Usuarios',2,'auth_token','81189c6fb3e7f6188f69f4fc98ccbce4aef6d58f497fea21f9087056877ebcb3','[\"*\"]',NULL,NULL,'2025-08-12 09:26:05','2025-08-12 09:26:05'),(52,'App\\Models\\Usuarios',7,'auth_token','d370aed08ba7e9e8f5d7b74589c24b8014ba5f5691169de82cdb5c74a3fd7aa0','[\"*\"]',NULL,NULL,'2025-08-12 09:47:48','2025-08-12 09:47:48'),(53,'App\\Models\\Usuarios',2,'auth_token','4372eb7839ab7677d246acb66b77bb65a1be97b55845ac0e517b0a98cb7e6ed5','[\"*\"]',NULL,NULL,'2025-08-12 09:51:28','2025-08-12 09:51:28'),(54,'App\\Models\\Usuarios',7,'auth_token','3a4cb528787a9563f279ccad90fbf53c488730ff8f82c72a6dc375a5c1952b46','[\"*\"]',NULL,NULL,'2025-08-12 09:52:41','2025-08-12 09:52:41'),(55,'App\\Models\\Usuarios',2,'auth_token','2dc72aa8b7bc26c204f8b361ac349f42098629ba6a3f5085b039ae0e458df3e7','[\"*\"]',NULL,NULL,'2025-08-12 09:53:45','2025-08-12 09:53:45'),(56,'App\\Models\\Usuarios',2,'auth_token','073241d38ae6e858a3366a0d2ecda9ed244c28f277458139c9677f8c9dd00670','[\"*\"]',NULL,NULL,'2025-08-12 11:27:30','2025-08-12 11:27:30'),(57,'App\\Models\\Usuarios',2,'auth_token','8c7d0a96b1a27483ea813601338b12f9447355ef21450b8fc4bd26843a6ae985','[\"*\"]',NULL,NULL,'2025-08-12 12:52:54','2025-08-12 12:52:54'),(58,'App\\Models\\Usuarios',2,'auth_token','76686f2455c35d568f5bef7b0bdfbc01df30355c493bb4212b824cd60f5af09f','[\"*\"]',NULL,NULL,'2025-08-12 23:14:11','2025-08-12 23:14:11'),(59,'App\\Models\\Usuarios',2,'auth_token','b969e3f2f97c7e2fc08fe72f4361c13a8712d8e6dbbb534339f2ef8230d87bd5','[\"*\"]',NULL,NULL,'2025-08-13 06:39:58','2025-08-13 06:39:58'),(60,'App\\Models\\Usuarios',2,'auth_token','88b7287de2f68375119c4daaac22e5f4c04dbe9607997036273c1d9cb034f2b0','[\"*\"]',NULL,NULL,'2025-08-13 07:49:11','2025-08-13 07:49:11'),(61,'App\\Models\\Usuarios',2,'auth_token','2ef660ac4b7466ec8fd7a3026cc7fb4d304f94cd931cb274bf8f4ad099590207','[\"*\"]',NULL,NULL,'2025-08-13 07:49:22','2025-08-13 07:49:22'),(62,'App\\Models\\Usuarios',2,'auth_token','eb7d7df5d9153dc796a2f098762c791c89b48f761697c232259801895eef8ce9','[\"*\"]',NULL,NULL,'2025-08-13 08:09:18','2025-08-13 08:09:18'),(63,'App\\Models\\Usuarios',2,'auth_token','40450d485e407f755b72879f64f96db030b9ecc4a94a20f6d5b0e95fc7630d36','[\"*\"]',NULL,NULL,'2025-08-13 09:08:05','2025-08-13 09:08:05'),(64,'App\\Models\\Usuarios',2,'auth_token','687c61f7c4edb8bc4a532351066033b4576362a94905c30ee0c5f42e56928bb8','[\"*\"]',NULL,NULL,'2025-08-13 09:25:51','2025-08-13 09:25:51'),(65,'App\\Models\\Usuarios',2,'auth_token','a65651ec18d80cc1b34bf6d0888b4af5b3e1fe03debecedbd673ed07e58e2373','[\"*\"]',NULL,NULL,'2025-08-13 09:36:11','2025-08-13 09:36:11'),(66,'App\\Models\\Usuarios',2,'auth_token','36f956184c944ffb73c445423d4fe1e23c766c091f294bf736315c7655f6835f','[\"*\"]',NULL,NULL,'2025-08-14 12:58:59','2025-08-14 12:58:59'),(67,'App\\Models\\Usuarios',8,'auth_token','e78f9b086dd85a681c04d3b4b4ca0076c7f847fceca51f0d4dfbfdaa5963a487','[\"*\"]','2025-08-15 21:21:57',NULL,'2025-08-15 20:52:53','2025-08-15 21:21:57'),(68,'App\\Models\\Usuarios',2,'auth_token','181795fa282dc35c7e828381d6969505b1a7ae2337f448a3c4b138c0a49d4fae','[\"*\"]',NULL,NULL,'2025-08-15 20:55:59','2025-08-15 20:55:59'),(69,'App\\Models\\Usuarios',8,'auth_token','2adffc944b698f3503cec425918412e806eaf25cca7f763d55aa5f3fde03f972','[\"*\"]','2025-08-15 21:37:09',NULL,'2025-08-15 21:27:37','2025-08-15 21:37:09'),(70,'App\\Models\\Usuarios',7,'auth_token','8dbf85ff5195886886db962a5a484f46326d09714dfc137b3c1bd5dd66667736','[\"*\"]',NULL,NULL,'2025-08-15 21:36:53','2025-08-15 21:36:53'),(71,'App\\Models\\Usuarios',2,'auth_token','90efbf6529defbb27d4cc50c5fa3355ba0e46097d353763f3ef292ca2b1e65f5','[\"*\"]',NULL,NULL,'2025-08-15 21:40:02','2025-08-15 21:40:02'),(72,'App\\Models\\Usuarios',2,'auth_token','b2c4bf13b2bc54428b504d13299c6e43284409578f255c5b1a3f909fc3ba2ca8','[\"*\"]',NULL,NULL,'2025-08-15 21:49:40','2025-08-15 21:49:40'),(73,'App\\Models\\Usuarios',2,'auth_token','73252eb73641f98bfe03104397d0307386584dd2ce54734e9cc401ace090a9f6','[\"*\"]','2025-08-15 21:50:50',NULL,'2025-08-15 21:50:42','2025-08-15 21:50:50'),(74,'App\\Models\\Usuarios',2,'auth_token','ce06fd3726acc148129f238d9bc79998fb351c73b720c46db333fbb71b54a36a','[\"*\"]',NULL,NULL,'2025-08-15 21:54:01','2025-08-15 21:54:01'),(75,'App\\Models\\Usuarios',7,'auth_token','caf81a71616a4bef77aec0c4718b1f38b436e501b9a127d82f210034cca9a93d','[\"*\"]',NULL,NULL,'2025-08-15 21:54:18','2025-08-15 21:54:18'),(76,'App\\Models\\Usuarios',2,'auth_token','9d6b3870c04fe36156aef09e7eee0f9619f287ae9acab17df22f0474e7691ec4','[\"*\"]',NULL,NULL,'2025-08-15 21:54:46','2025-08-15 21:54:46'),(77,'App\\Models\\Usuarios',22,'auth_token','e723b018356164053babc66f69f6a7b87915d163da4ff1d3da8096c987a4b39a','[\"*\"]','2025-08-15 22:01:47',NULL,'2025-08-15 22:01:28','2025-08-15 22:01:47'),(78,'App\\Models\\Usuarios',23,'auth_token','2d429252d9f0c919a2077bcf0578e622b59c13644d22263ab09aeb3c6d74e318','[\"*\"]',NULL,NULL,'2025-08-15 22:14:37','2025-08-15 22:14:37'),(79,'App\\Models\\Usuarios',2,'auth_token','fccd821cbe5d6f6da5b7e388c98b42e6b511cbe64624298652d4da818a18d2b3','[\"*\"]',NULL,NULL,'2025-08-15 22:29:39','2025-08-15 22:29:39'),(80,'App\\Models\\Usuarios',8,'auth_token','7d0deae1cfb2240dd958a6d4279c2bdd594550549b64e4d28d6d9cf142222957','[\"*\"]','2025-08-15 22:36:44',NULL,'2025-08-15 22:32:34','2025-08-15 22:36:44'),(81,'App\\Models\\Usuarios',2,'auth_token','aa31fc07ff07af296d3096bd9403ed7b92ab3c4a47352a99f1b50108b0bc4646','[\"*\"]','2025-08-15 22:56:07',NULL,'2025-08-15 22:56:04','2025-08-15 22:56:07'),(82,'App\\Models\\Usuarios',2,'auth_token','b6cda7334cb3d57100d6016e86268cf8b98659a3924b4327d22c5338ad334ddb','[\"*\"]','2025-08-15 23:07:42',NULL,'2025-08-15 22:57:14','2025-08-15 23:07:42'),(83,'App\\Models\\Usuarios',8,'auth_token','20484bbfd362cb0507730df5b7b2d53d05dca6692b4361ecb49f8a637ed6f4d3','[\"*\"]',NULL,NULL,'2025-08-15 23:39:09','2025-08-15 23:39:09'),(84,'App\\Models\\Usuarios',2,'auth_token','18dd14e0829a5555056f4a56ce39fd9642bcc2671ec9739747315a9ae9ce4878','[\"*\"]','2025-08-16 00:11:25',NULL,'2025-08-15 23:56:43','2025-08-16 00:11:25'),(85,'App\\Models\\Usuarios',8,'auth_token','a8d3ed0c6403fb21cc10430a84ac7b0636a7fb767df4db9bc6d6c03cb0ddd9fd','[\"*\"]','2025-08-16 01:18:49',NULL,'2025-08-16 01:16:18','2025-08-16 01:18:49');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productos` (
  `id_pr` int(11) NOT NULL AUTO_INCREMENT,
  `nom_pr` varchar(80) DEFAULT NULL,
  `precio_pr` decimal(20,2) DEFAULT NULL,
  `status_pr` int(11) DEFAULT NULL,
  `img_pr` varchar(300) DEFAULT NULL,
  `id_cat` int(11) DEFAULT NULL,
  `desc_pr` varchar(100) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_pr`),
  KEY `fk_categorias` (`id_cat`),
  CONSTRAINT `fk_categorias` FOREIGN KEY (`id_cat`) REFERENCES `categorias` (`id_cat`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (3,'prueba4',1500.50,0,'prueba',1,'Mochila con GPS, sensor de peso y bocina integrada',50),(4,'producto prueba 2',450.00,0,'https://ih1.redbubble.net/image.4968445696.9023/drawstring_bag,x600-pad,600x600,f8f8f8.jpg',1,'prueba 2',10),(5,'Mochila Pro',1200.00,1,'https://www.officedepot.com.mx/medias/68352.gif-1200ftw?context=bWFzdGVyfHJvb3R8MjE1NzA2fGltYWdlL2pwZWd8YURVeUwyZ3pZUzg1TkRJMk5UUTJORFU0TmpVMExtcHdad3w4ZTNlN2UxZjliNWMzZWViYzA2ODA1YWEzOWI5NDdkNjFiYTc2NWUxMzRjMTc0ZTE2YWU2MjE5MTViNzdlNzkz',1,'Mochila con GPS, sensor de peso y bocina integrada',10),(6,'Mochila Pro',1499.90,1,'https://mi-cdn/mochila.jpg',1,'Mochila inteligente con sensor',20);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('1nPiNVN66Y3dnRWUczLbIUUSy8D6BuACqBwz6lDO',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoidWJrTnM3N2NLZFJOUDVSYVFKSGY5eXlZdjBvcjA2QWxLWW9zUG1RbSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755279549),('20Rscnc9fsgccnCESllGgQOcwYzrzJcSl8b0Jvux',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiS09KbUlJaE1iTUNFOVV3VzY1NzJoMzBpVndkQzNkWm15clQza2d6WSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755273277),('2iWJnZHIkvRzzemkkGQT8GWLuhLfgwUDjPHBMAj0',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoibEJhMEloRnV4dWdmcXZwb0Q1bGNodDE3b1N5MWxPTXdaMWFTVkVUZyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755285378),('3AKbdT2y40ZXxgzU2pA1lDdP82dvBOhMvKdAvLxk',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoicEt5bmFza1BDN3lWZ1BtZE1oUFQ4TGsxcXJYTVU1YUdKYlBXcVFxMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755273262),('3jiGouj9gev2W6Y3kL023zlEJ9iok7y0EKUBNGYo',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoicUFTZFUzRXREYWE0U1hnV1owemwyUEpvR01ReDdhRVZPdUw0b2lqbSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755276964),('41Hiq9h4k5OJ1gwnoIhmXkNRuK53nmTbru2qvmSb',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoidEVTdkFCUVNNakNwUUxiTlNhbnlpYmNWTWg1aklvaHJmdFVwMDNCdSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755275560),('4zxKoHLm9PqejGrYJx00wKGYpv5iDAsAQTsMyBD4',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHVid085TEtFUUpZakNiUWxaZnJOcDdzMzdCRXp6cGtpV0tBelAxRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755285432),('57mlJBCygej1wscAlT0AexHFTIWXjD3SUhp71qoy',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoidWxzT2xpY1V6U0VmRGVybVNINHRBazZMZGRqWDlBQkNnRW54UU9mOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755271657),('694UbSGbICAcbRH09MSHWfLqKGPvb9EPBFv3DKiK',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoid0IxaXI2Zm83RmhqUHZIVmUzemt1Ym1KTURkUDNLNlNka2NVckFFRCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273642),('6ul1t6aqOCNaimlstSARjR67tLDAzd9E6wZr4AMz',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiUUJ5cmJpZFpvR0tJRnYzSUNXT3RZQ3p3NmlWSmZ5NEJBdkk5aURBWiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273241),('7bmrJKV0cRZHAww52i2wfYtwPTB3gYzCbdRZj1zS',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoibHdFcUlUdHBvTTBCOUVpdEttc1lReVJPSkcyanc0RzZ0aUVFWUNnTyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9jYXRhbG9nbyI7fX0=',1755285413),('8bD4iNdPg87d2tcnS4YfYtwTMvnZtM5d5Z8YIhjf',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiY29UYWlTUlFNdFJWRW8wTXRwMW9CYXJwY3ZpMmdXNEdKQmZpQjFMMiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755277034),('8NvGTCNcyqFjtaLcmlchj63IX8LZV4UzpV0r7cyg',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiMkN0TkRZYW1mNTBIcU5RUW5xS2N1TlVabEhBYVJBMlY4dXVTQ3JqYSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273286),('982rfJsLQlbwYqzPKJu2nS6NaaMqNlUUzyiXjw9D',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiS1h0Q0Y1dFZLM3R2aGd5WEtSQUlvWkZTSlo1RmdSRmlvbkZQeHdvTCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755272980),('9JBoXgt5BYVwJVorBfgUpTWnvaDsDynbJfknC7VL',NULL,'192.168.50.22','Expo/1017702 CFNetwork/3826.600.41 Darwin/24.6.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoidkhYcUpQdm1mVFNrRGlDQWNIVGU2UlNxWE93ZEZIRFdPeDlWZTNPQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly8xOTIuMTY4LjUwLjEyMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755270702),('A5oHU7URddPCJT2L1vgzSe3GTHdNnADsvBEXWijd',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiOEp2UjJvcHlDNU5uWnpqcm5DNFJnR2tiWm9xcjFlMTdNRGR2cUczZyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755272402),('aN6w9IUSu4BMeeGGtrBBa6I9mQkasn3o45zewdI3',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoibkgxcDBHclpqSVhzSlN0UVhLdW1xYWRnMkFHRmdDQ3REM3BuM1hoWSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755280603),('BPLSztqPRRUOO9wMgTVr47GDmdOy52XC01TtpQwX',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZldqNmdybVhIMmRiYm1WelRNWXVrVHM5NzcwTmlEbnk5cnVaeVl5OSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9jYXRlZ29yaWFzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273266),('bYzisB7Ed33gjLUq3E4UngQMVPXAy1RPCG8iXP7c',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiaTd1WkNZNm1ibnQyelg0YURWNXczMkZ4aTZPVzZ6em5Ca0xDVDZmYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755281486),('cbSesAr6isDCzNrrGsqznfEAj5JAo5LbE0CbEAPc',NULL,'192.168.50.22','Expo/1017702 CFNetwork/3826.600.41 Darwin/24.6.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ0lSTGNKOHBGUlI0dm5aZVlzS2JwYmVOeUhWMjZGMXlCTzBxZ0VtUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly8xOTIuMTY4LjUwLjEyMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755271317),('CqSoH06PCtIdhIjecoYD06JKXcBJoLNRGYcs7YZo',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWEtNTG9JcmNEVjJ0eTNaOVNnRTVtbFZZdXpSd2xUbXVuT1p5WFBKTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755277462),('Dav9xyEPoB0CgUSxPgznFp4QcBprvVoLfYCuJktj',NULL,'192.168.50.22','Expo/1017702 CFNetwork/3826.600.41 Darwin/24.6.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWEVyTXpRSEZKeDI4M0tjZGhmdFVZaGdlVHdLWlpleEIxbldwT3VEcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly8xOTIuMTY4LjUwLjEyMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755270910),('dcYeJ9rVbXGm5oqLbpl0zSwVlNS3HKoB8GZYd70l',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTlo1T0g1ZEJlVVl5Z1VjN2V3RkdkM1VodTVzRDNOS2NnM05xQWtHOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9jYXRlZ29yaWFzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755272372),('DyBIvTHVfBEsbuin6Zt9UngPA5nNyuzE9QJmGBZ6',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoicVFBUWU3UE5sQzhxMXVaekZWVHJ4NDBtWDZMenJRazlFZzJXVVljQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3MvNSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755273266),('DYXxJgosvE44rXzW7Ae0j3JpI0hHbmgAPduYlz7S',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiRWozTGVUa1JyNDBCYnd2T3BXODQ1VEZKS2N0ZFNLcTBjb2tNTm1ENSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273258),('EQFnAeE35UzY72ryoNtZXZLAs9Z1Xo5dAhu4h0Vs',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoielhGMEMwTUthMmRSWGdiRE9IZ3FOUGlwWlZFcEVxMFBMcHhYVjB5YiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755272216),('f2OmHnWQi3iargE9IBg5VIepDqS9iwo3hGUeNKoR',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiclJrZnZpdlJzaFRuVm40WmVJRU5KNURsY0VmdVM2WndLZkZiSWpYbSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755271878),('fGOJar4UmEougN7zfzr6XosILbpP73ZY6acuZx76',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYnBVSWdwanRXQm9kdzFqVUdSVHY1Vm1waVJUUldrOGlxZEZMQjdIMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755272371),('FguPngZjLpWfU5AR7ZvAwaHD4l03MmHa33FcqQq9',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiNzZmbUg0cEVHaTlTUm9SeE9PbDNGVHpQYUZHcjVBWWNzMWU3WWREZCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755272392),('foUxhV5xxeMcEm1YBMaOdf2xlhpd9Ijoo9adkkDi',NULL,'192.168.50.22','Expo/1017702 CFNetwork/3826.600.41 Darwin/24.6.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiS0dUTGFiaE12VXJtUnVJNFBXaFkyQ0JCa1BsZXdUUHpSZmhqVjdSbyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly8xOTIuMTY4LjUwLjEyMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755270907),('FXCPXYU7qSFncEEk7Uq7QQW553mxN3C190KVoKrZ',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiM3RGbWtqeEs2cWFWN2JiWDRPcGVjc0Nva2RQdWY2emdORU9LdWdpNyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755272229),('gPMZZsPUsQaPA6MHsNAp4vzkAglryELIjSLna7Zw',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiTXZwRWFuNEVjMHFaN05KcVZzMmNPRko2cktXb1BaM002eElPZDAzeiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755269759),('h4ht9XLpvFGVdMEcYHKGMCsE9aZN1NGKsGhIBOHK',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoicllpQnZZdElFOWFhRG5ocVN0d3pRSjE1aG5oWU9xTzNvN3lIaEY4MSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755272308),('HmqATQd8BFqDqZ34Vv6tFRcsgQMYhPKYkVkJ9DcX',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoidFZGOFZOR1hNYmtoZlE0M0xJS0FnRHl5OHV0WHhWYkVMZEQ4ek9yUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755277662),('hvrsqd6tl3ywzi7A27L7NFfA3tISSvIfzzKHNhxt',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMm5aWDhZSzFNdEtzS21kMzdsOGozaGxvenZibjNISVI4amtWZjdabiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755275804),('j1XhlgExOUdZbsemZ9abh0JZlqD7tGJVs5MJonxa',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiS1NvSkpWS1kzQ3R3RnNKUGQzcUhxWDZoQ2dzcGxDWjgxUzQ5anNJWSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273703),('JLJC7s97dBZKa6bCxp9FYCFqvsIUQ38P04nLV6jX',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiQk1OOXZKdk5vMUhHYkxETUw0N2NWZVhid01VR2dXZ0hvMjhHdTVZTyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273688),('KXorDyqOLxM0XWSmAzbO2FcCGb0C4FppbcXDWsXb',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiSEtrSzE1WXBIcU11WGNJNWxlT1VBRUhCbVVvZHh3UEhETUNhN1VyYSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755272316),('lX7dNvTqcllaoM3jDbm0r1isIbNq4hT07LSOK3jq',20,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTo1OntzOjY6Il90b2tlbiI7czo0MDoiSlFxNkhhcjdaTWhUOXZCQmRoNnZHUU5tTVc1RXpZQnJOWWdMUVFPMSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1OiJzdGF0ZSI7czo0MDoiZGpzUzA3M2luU1hJN0V0eFFSVTRmYk4zQ2o2NjBwbkFSbXYzVGZDeCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9jYXRhbG9nbyI7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjIwO30=',1755058662),('MZ9YDA8Aciv6RcK0qSXh2CtNAje67KyXb70pwuID',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoieVFUUUIya2ZqM29ub2o3SDVlZjVqQkZiNGFaaHJUOHNVUHhic2RKTyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755272213),('NjVFQNEtbKWwFZAJ2WmjgWK9HvtnneREmsnD2K0e',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYlR5WHpaRHZ4c0hmd09KZGk4YlI2dEVKVW03SmExbE02S2V6cnZXYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755272217),('o23R5OWAbFNF4oFPwkEXX2Tm00ZaWpkSP6VwJlsJ',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiU1NTQ1R4MTVORGxnVWZpMGFxSVBHQ0xOWVpXejVGbjJHT1NJSDlpWiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755274469),('ogCHEq0HIFMREYzBZle9RecQyXkijZKEaP6KoS2v',NULL,'192.168.50.22','Expo/1017702 CFNetwork/3826.600.41 Darwin/24.6.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmZubUlseXNaNGw3bWpoWWgzS1NqaTVaQXZWb3RVNW4xSzQ1ektUcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly8xOTIuMTY4LjUwLjEyMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755271019),('ozWCmN4LSTQdBZqzSxJoEVbVoFVcgIHtPui2vLjP',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoia3RrbjlHWTBTOUJldlhxdkhTbE5YWGY3SVByeVIxbXE5eDZHRmlVVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755285529),('pAoFFUAdgTTBqSKaBfbPmsu3MXDWiZL7Vhtppj6Q',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ1UzYUQ5WlhZemROVlh5aUI0amx5OHNJUnAwSGdDVmFCRWJwV1JqTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273691),('pJOf4NiKMUOE4CLahjZ2pBooH9oDKOCMdPvKptbS',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoicVN0ODBFWXFST1VtV1NHZktNNDcydjdTblppTzZUQktTVTc0bTI4WiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755272308),('PzPhNSKkdcZm2c1ihOV7J7qoKU8lLKk5FhiIPFWW',NULL,'192.168.1.100','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiUzhaWmUxTUxBazRpeEhadnExcjlWa0IyT1drclZnSmdKeVpORWlGTSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755154739),('qe8FZI5U2507fhdMk27PvmR8gCht6cuxbCcmL467',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiSWNoMXpEU0cyQlhlalE0UkVqMFUwMkZsRWpidlhxZmVIdjlPbzVCbSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273050),('QpEDD9ghxT09B5WNhQrSWCps3PMXdgvDcia2gJD8',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiZGpEZnNlTjd6WDA5S3VkMTZaZEpxclZFMkpSYTNrUjNjeTRNZ29TMSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755274477),('QqWgsje5qVpT5J0fmWvoMhHtdxe3QZRZNq4NNe0X',NULL,'192.168.50.22','Expo/1017702 CFNetwork/3826.600.41 Darwin/24.6.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoicXY3Q01JclJmVUJxeDJjMll4QWpxVGRvQVM2bjA3eEZiQjJpczVCaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly8xOTIuMTY4LjUwLjEyMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755269645),('qua7q0123ht1fzMXfqJT8L59w8x3qIEXjHP6gYL8',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiOWVjMm80cW9GT3B6dmJ5WVhiNU9YSTZibTJYTkJlMnBUZ1ZRdU42WiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755275379),('qv0Cw2b9GCSeoLSDsFB5axf6DrXhTeShgarBzxOV',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiTHRqVlJ3T1hZN2JEUWluTFAyVklQekdXS1dQY3Z2dnBzNnJhM0dlMCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273042),('rkIxB17U0I7FZ2TIOpSUHV7gXO209fB9MG0JBMvP',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDVtUno1cjI1MFlvSVk5eFlzTG44WTlmampmRXF1dXRtOXlRdGp2dyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9jYXRlZ29yaWFzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755272372),('RoVA4Pr4BV7rIet4y5u3cVHBABm3YKdbpcW7lDuQ',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ0JHZHYxZWtJbUVwTEdJM1lKUHVmWTJpdWZTdHk1WWx1dFFTWnlJayI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755273261),('RTI0esaZptfv9Bwm6UOzBNb4GXgs6mzgoMfMw70q',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiWEZHMURpSlpLUk9RTlJvSUJYeUh5NUFiUmFna3JBUG5SaDZGM25UTyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273275),('SFCnlVGj6q4M7UutL9wztFUGhUhq3aTKmejSxC9t',NULL,'192.168.50.22','Expo/1017702 CFNetwork/3826.600.41 Darwin/24.6.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiNkNDUjZpZ1ZvQ1M4VTFJYWJDR1dUSThUUXdtT0k4REMyY3g0bGdzNyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755269573),('sRWSi26srvyeCqUqGoaPi1sGYkllml9F001kqydC',NULL,'172.20.10.11','okhttp/4.12.0','YToyOntzOjY6Il90b2tlbiI7czo0MDoiWEkzSGNWQ21mRjMwNHpKOXo2NFRXWlZLRlNpWTJDbzhpYzhteWpJSCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755275554),('u0MiMWQELgaBSrE5D4mh4kdgyda45X1JeXDqWmXI',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQlZkaWN5b1NSTHZIb2s2WkZkM1V4WTRwTW8wdDA3bXg4bkd4S2RJaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755271659),('UGv0DEKylnaUp9YHAPbXiwS2lnIgsgngTJcebPGp',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoidGJVWDZWS2lDaDNkS21HOW1RRGM4ckJCMW56TDYwSU0wcEN4SEUzUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755272371),('uQm7aHTfmQM9lxQ1mWaYhWLQ9pjMG5rOmAL3fmOP',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoid0JRWTdJTWw5SWxMUGUwY1pOeHlDUENySVJ6VFhGS1BIQUxsSDhWYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755280605),('vHkhCkOSF89YQPGjqw41rnT7I8w5eGKPYMZPMy7q',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSThWdDVXSGpFVkVFSFJMblRXSVpEanZpTm00SElJSXZ6Nkx2eVdxRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273707),('WcZwUaI3Y7q5m5VelhPkYVFECTirkyUa5VSTyh8I',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiNkxyZlB6dVpUMkJ3dmZlWlZQMU5HS3ZxT2FBRDNYSVN1U3dTV1pBeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3MvNSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755273266),('wdgdkEE5RuVVa0162tQLmNcMwsOXB3ClJIpCLv6T',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoibE13c2ZKRGdjdzdKT2xIcEpEc3FSTnpRV1pmRTF6MHZUc1d5Z1RQcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755272394),('wgzgdRffgHYJpJ63t3S1kXdahsODJhOLKjKI61aj',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiaUFMUVFBR1pScHdhb3JRS1N4M01qbjcwSm45NDVrMHFnZnk2MXBIbyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755276967),('wnVG83KMZu1OGdGBLS84psU72HuYGGQekAwpmv05',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkZRUXliMkI3elVzcGxnRDliNm85bExJR0JpaHo1VThSdFpaeXdJbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9jYXRlZ29yaWFzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273266),('WrWm3zqKmeRGEZf6ulK8bCIF25kpxt2WgzSRnsDp',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoibTZXbzlPTDZWWmhPUHJYMWdwRTdBN0JRSFJtd2J5TmxDbEZEeVpCMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755273277),('XA2klq4bUdA6fYp8rkxZQJOTCZJaJkCqbYXX4fC3',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVEc1aHp3Um5CV21sV05xekE3R2tIeGNnQzFDa0VoM2V4MTRFemZMWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755272316),('ySKPIrq45ukf7UooLuvkuCFziBQrz68s8FjmNJUW',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYzlQMnlVcTN0QVlhekh5UWc0Q0RKdmFjNTZWNW9rRXBXbUZiS0FXbSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wcm9kdWN0b3NBZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1755272393),('YZ9cKQakPFSGcqUcCbBFPlPImX7SJk64wRXVNr9V',NULL,'172.20.10.11','okhttp/4.12.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoieTdNaVdCakxjMzRxakllZXdYOTRiekVZN1J4UmFsRThmZllWT1ZjWSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xNzIuMjAuMTAuMjo4MDAwL2dldC1wcm9kdWN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1755273044);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_productos`
--

DROP TABLE IF EXISTS `usuario_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario_productos` (
  `id_us` int(11) DEFAULT NULL,
  `producto_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_productos`
--

LOCK TABLES `usuario_productos` WRITE;
/*!40000 ALTER TABLE `usuario_productos` DISABLE KEYS */;
INSERT INTO `usuario_productos` VALUES (8,'123456'),(2,'123456'),(22,'123456');
/*!40000 ALTER TABLE `usuario_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id_us` int(11) NOT NULL AUTO_INCREMENT,
  `google_id` varchar(255) DEFAULT NULL,
  `nom1_us` varchar(50) DEFAULT NULL,
  `nom2_us` varchar(50) DEFAULT NULL,
  `ap_us` varchar(50) DEFAULT NULL,
  `am_us` varchar(50) DEFAULT NULL,
  `email_us` varchar(100) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `nom_us` varchar(50) DEFAULT NULL,
  `pass_us` varchar(300) DEFAULT NULL,
  `tip_us` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_us`),
  UNIQUE KEY `uq_usuarios_google_id` (`google_id`),
  UNIQUE KEY `uq_usuarios_email_us` (`email_us`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'victorcito','123',2),(2,NULL,'Victor','Yasser','Campos','Gonzalez','vic@example.com',NULL,'cxmps','$2y$12$tnKt7Rdk6gKyfjlYd0L0cOKsAwTt8KVFjvU5q51C.fgGp1VUmW7se',2),(3,NULL,'Jovanny','Guadalupe','Lopez','Cebreros','Jovas@gmail.com',NULL,'jov','$2y$12$BRSwV9kj6jhGT9vksu/IP.gJiHfhXzFPxAH5OuuI8.QqJInA7I0Zq',2),(4,NULL,'Juan',NULL,'Perez','Herrera','Juan@gmail.com',NULL,'Juan','$2y$12$FUET/apgxi3ielQvMGewzub/whLUBdjdj556aox49AmPVg2aTsdMW',2),(5,NULL,'Jovanny','Guadalupe','López','Cebreros','jovanny6767u7@gmail.com',NULL,'Jovas67','$2y$12$.CNVuloDZHKPRER/ja7vrebujNpZeRwD5HAmbyNBqqTULTupRiaQC',2),(6,NULL,'Pablo',NULL,'Arroyo','Domínguez','Pab@gmail.com',NULL,'Pabs','$2y$12$bukcEgxT4odxxkpOtgXdWOme3Y/86A7ddrU9o79dmU7n6s8vvBD1G',2),(7,NULL,'Victor','Guadalupe','Lopez','Cebreros','victorAdmin@gmail.com',NULL,'VicAdmin','$2y$12$DgZb9h169ImKq.uaqOq5q./L2a4d96rMrgOUckzLE9HHkBn2gdOqi',1),(8,NULL,'Victor','Guadalupe','Lopez','Cebreros','victor@gmail.com',NULL,'Victor','$2y$12$hdAhJy9WohRMDvHhoe8aj.3WK6skDPnITf1htPUDN1ZvKSofZXI0K',2),(20,'107396910340567568003','Victor','Guadalupe','Lopez','Cebreros','2023371089@uteq.edu.mx','https://lh3.googleusercontent.com/a/ACg8ocKNpPdhPsnNt_mAJRKb03eAO7fI4FnsrBqItbQ3gJtFmgOQbvw1=s96-c','Victor Guadalupe Lopez Cebreros','$2y$12$H77.RrFTCpK3atg5Qb.fP.4ZRnGuOnjsKFiwVHDbAQw4mDtm4HWS2',2),(21,'110956241821273570617','Victor',NULL,'Lopez',NULL,'victorlopezcebreros117@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocKUXdVTXBZQ7B_YF_8Bs5EFt6lkm7TnZr8kAYyzONqAGmVO8w8=s96-c','Victor Lopez','$2y$12$eZUJoetvHSRdrprzELzSNelgUWLdRc2x5/TlV4jHFB/082fPWkNve',2),(22,NULL,'Ricardo',NULL,'Robled','Tapia','Ricarod@gmail.com',NULL,'Ricardo','$2y$12$/y9fesJ7kVtbzqLyfyhPke8TNjQ9LDw9f92ObOJI4fHZuRFfFdMOS',2),(23,NULL,'Victor','Manuel','Aguilar','Sanchez','victorAguilar@gmail.com',NULL,'Vic','$2y$12$qIlKYAMaNGdnAG859.e96uTvUX51HRAAFieqT602RMLUtiXbKlxkq',2),(24,NULL,'Victor','Daniel','Lopez','Hernandez','victor@test.com',NULL,'victor123','$2a$10$Bz4hpp0oFCla7vmjjmJeoe2E4EZdL4caObbAG0PptKbqj5X0scJHy',2);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ventas` (
  `id_ve` int(11) NOT NULL AUTO_INCREMENT,
  `id_us` int(11) DEFAULT NULL,
  `id_pr` int(11) NOT NULL,
  `fec_ve` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total_ve` decimal(20,2) DEFAULT NULL,
  `paypal_order_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_ve`),
  UNIQUE KEY `paypal_order_id` (`paypal_order_id`),
  KEY `id_pr` (`id_pr`),
  KEY `fk_ventas_usuarios` (`id_us`),
  CONSTRAINT `fk_ventas_usuarios` FOREIGN KEY (`id_us`) REFERENCES `usuarios` (`id_us`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_pr`) REFERENCES `productos` (`id_pr`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (1,20,4,'2025-08-13 04:17:42',450.00,NULL);
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'edumochila'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-16 12:29:55
