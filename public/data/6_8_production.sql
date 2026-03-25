-- phpMyAdmin SQL Dump
-- version 6.0.0-dev+20251117.dfcf3dd949
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 25, 2026 at 01:22 PM
-- Server version: 9.2.0
-- PHP Version: 8.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `6/8_production`
--

-- --------------------------------------------------------

--
-- Table structure for table `adultaccount`
--

CREATE TABLE `adultaccount` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `teacher` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adultchildpermissions`
--

CREATE TABLE `adultchildpermissions` (
  `id` int NOT NULL,
  `adult_id` int NOT NULL,
  `child_id` int NOT NULL,
  `can_view` tinyint(1) DEFAULT '0',
  `can_edit` tinyint(1) DEFAULT '0',
  `can_view_sessions` tinyint(1) DEFAULT '0',
  `can_edit_weekly_plan` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auditlog`
--

CREATE TABLE `auditlog` (
  `id` int NOT NULL,
  `child_id` int NOT NULL,
  `action_type` enum('session_created','weekly_plan_changed','streak_updated','login','logout') NOT NULL,
  `action_details` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `childaccount`
--

CREATE TABLE `childaccount` (
  `id` int NOT NULL,
  `adultId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `following`
--

CREATE TABLE `following` (
  `following_child_id` int NOT NULL,
  `followed_child_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int NOT NULL,
  `child_id` int NOT NULL,
  `session_date` date NOT NULL,
  `hapiness` tinyint NOT NULL,
  `quality` tinyint NOT NULL,
  `practice_day` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `streaks`
--

CREATE TABLE `streaks` (
  `child_id` int NOT NULL,
  `current_streak` int DEFAULT '0',
  `last_practice_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `weekly_plan`
--

CREATE TABLE `weekly_plan` (
  `id` int NOT NULL,
  `child_id` int NOT NULL,
  `day_of_week` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  `practice` tinyint(1) DEFAULT '0',
  `color` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adultaccount`
--
ALTER TABLE `adultaccount`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `adultchildpermissions`
--
ALTER TABLE `adultchildpermissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `adult_id` (`adult_id`),
  ADD KEY `child_id` (`child_id`);

--
-- Indexes for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `child_id` (`child_id`);

--
-- Indexes for table `childaccount`
--
ALTER TABLE `childaccount`
  ADD PRIMARY KEY (`id`),
  ADD KEY `adultId` (`adultId`);

--
-- Indexes for table `following`
--
ALTER TABLE `following`
  ADD PRIMARY KEY (`following_child_id`,`followed_child_id`),
  ADD KEY `followed_child_id` (`followed_child_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `child_id` (`child_id`);

--
-- Indexes for table `streaks`
--
ALTER TABLE `streaks`
  ADD PRIMARY KEY (`child_id`);

--
-- Indexes for table `weekly_plan`
--
ALTER TABLE `weekly_plan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `child_id` (`child_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adultaccount`
--
ALTER TABLE `adultaccount`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `adultchildpermissions`
--
ALTER TABLE `adultchildpermissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auditlog`
--
ALTER TABLE `auditlog`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `childaccount`
--
ALTER TABLE `childaccount`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `weekly_plan`
--
ALTER TABLE `weekly_plan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adultchildpermissions`
--
ALTER TABLE `adultchildpermissions`
  ADD CONSTRAINT `adultchildpermissions_ibfk_1` FOREIGN KEY (`adult_id`) REFERENCES `adultaccount` (`id`),
  ADD CONSTRAINT `adultchildpermissions_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `childaccount` (`id`);

--
-- Constraints for table `auditlog`
--
ALTER TABLE `auditlog`
  ADD CONSTRAINT `auditlog_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `childaccount` (`id`);

--
-- Constraints for table `childaccount`
--
ALTER TABLE `childaccount`
  ADD CONSTRAINT `childaccount_ibfk_1` FOREIGN KEY (`adultId`) REFERENCES `adultaccount` (`id`);

--
-- Constraints for table `following`
--
ALTER TABLE `following`
  ADD CONSTRAINT `following_ibfk_1` FOREIGN KEY (`following_child_id`) REFERENCES `childaccount` (`id`),
  ADD CONSTRAINT `following_ibfk_2` FOREIGN KEY (`followed_child_id`) REFERENCES `childaccount` (`id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `childaccount` (`id`);

--
-- Constraints for table `streaks`
--
ALTER TABLE `streaks`
  ADD CONSTRAINT `streaks_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `childaccount` (`id`);

--
-- Constraints for table `weekly_plan`
--
ALTER TABLE `weekly_plan`
  ADD CONSTRAINT `weekly_plan_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `childaccount` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
