-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`priority`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`priority` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` ENUM("urgent", "non-urgent", "critical") NOT NULL,
  `approxWaitTime` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `description_UNIQUE` (`description` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`room` (
  `id` INT NOT NULL,
  `status` ENUM("available", "occupied") NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`patient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`patient` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `injury_type` ENUM("head", "heart", "lung", "neck", "stomach", "bone_or_muscle", "burn") NOT NULL,
  `pain_level` INT NOT NULL,
  `date_of_birth` DATE NULL,
  `arrival_time` TIMESTAMP NULL,
  `gender` VARCHAR(45) NULL,
  `card_nb` INT NOT NULL,
  `priority_id` INT NOT NULL,
  `room_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_patient_priority_idx` (`priority_id` ASC) VISIBLE,
  INDEX `fk_patient_room1_idx` (`room_id` ASC) VISIBLE,
  CONSTRAINT `fk_patient_priority`
    FOREIGN KEY (`priority_id`)
    REFERENCES `mydb`.`priority` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_patient_room1`
    FOREIGN KEY (`room_id`)
    REFERENCES `mydb`.`room` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
