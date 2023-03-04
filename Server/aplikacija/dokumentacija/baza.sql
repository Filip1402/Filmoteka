-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema RWA2022fmilohano20
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema RWA2022fmilohano20
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `RWA2022fmilohano20` ;
USE `RWA2022fmilohano20` ;

-- -----------------------------------------------------
-- Table `RWA2022fmilohano20`.`tip_korisnika`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RWA2022fmilohano20`.`tip_korisnika` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `naziv` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `naziv_UNIQUE` (`naziv` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RWA2022fmilohano20`.`korisnik`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RWA2022fmilohano20`.`korisnik` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ime` VARCHAR(50) NULL,
  `prezime` VARCHAR(100) NULL,
  `adresa` TEXT NULL,
  `korime` VARCHAR(50) NOT NULL,
  `lozinka_hash` CHAR(64) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `datum_rodjenja` DATE NOT NULL,
  `tip_korisnika_id` INT NOT NULL,
  `token` CHAR(8) NOT NULL,
  `sol` CHAR(50) NOT NULL,
  `aktiviran` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `korime_UNIQUE` (`korime` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_korisnik_tip_korisnika_idx` (`tip_korisnika_id` ASC) VISIBLE,
  UNIQUE INDEX `sol_UNIQUE` (`sol` ASC) VISIBLE,
  CONSTRAINT `fk_korisnik_tip_korisnika`
    FOREIGN KEY (`tip_korisnika_id`)
    REFERENCES `RWA2022fmilohano20`.`tip_korisnika` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RWA2022fmilohano20`.`film`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RWA2022fmilohano20`.`film` (
  `id` INT NOT NULL ,
  `adult` TINYINT NOT NULL,
  `backdrop_path` TEXT NULL,
  `budget` INT NOT NULL,
  `homepage` TEXT NULL,
  `imdb_id` CHAR(9) NULL,
  `original_language` VARCHAR(50) NOT NULL,
  `original_title` VARCHAR(200) NOT NULL,
  `overview` TEXT NULL,
  `popularity` INT NULL,
  `poster_path` TEXT NULL,
  `release_date` VARCHAR(50) NOT NULL,
  `revenue` INT NOT NULL,
  `runtime` INT NULL,
  `status` VARCHAR(50) NOT NULL,
  `tag_line` VARCHAR(200) NULL,
  `title` VARCHAR(45) NOT NULL,
  `video` TINYINT NOT NULL,
  `vote_average` INT NOT NULL,
  `vote_count` VARCHAR(45) NOT NULL,
  `datum_unosa` DATETIME NOT NULL,
  `unio_korisnik` INT NOT NULL,
  `odobreno` TINYINT NOT NULL DEFAULT 0,
  `galerija_putanja` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_film_korisnik1_idx` (`unio_korisnik` ASC) VISIBLE,
  CONSTRAINT `fk_film_korisnik1`
    FOREIGN KEY (`unio_korisnik`)
    REFERENCES `RWA2022fmilohano20`.`korisnik` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RWA2022fmilohano20`.`zanr`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RWA2022fmilohano20`.`zanr` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `naziv` VARCHAR(45) NOT NULL,
  `id_tmdb` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `naziv_UNIQUE` (`naziv` ASC) VISIBLE,
  UNIQUE INDEX `id_tmdb_UNIQUE` (`id_tmdb` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RWA2022fmilohano20`.`film_zanr`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RWA2022fmilohano20`.`film_zanr` (
  `zanr_id` INT NOT NULL,
  `film_id` INT NOT NULL,
  INDEX `fk_film_zanr_zanr1_idx` (`zanr_id` ASC) VISIBLE,
  INDEX `fk_film_zanr_film1_idx` (`film_id` ASC) VISIBLE,
  CONSTRAINT `fk_film_zanr_zanr1`
    FOREIGN KEY (`zanr_id`)
    REFERENCES `RWA2022fmilohano20`.`zanr` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_film_zanr_film1`
    FOREIGN KEY (`film_id`)
    REFERENCES `RWA2022fmilohano20`.`film` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
