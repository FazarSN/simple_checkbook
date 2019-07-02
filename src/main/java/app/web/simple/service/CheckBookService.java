package app.web.simple.service;

import java.util.List;

import app.web.simple.entity.CheckBook;
import app.web.simple.util.CheckBookUploadDto;

public interface CheckBookService {

	public List<CheckBook> findAll();

	public void saveFromUpload(List<CheckBookUploadDto> dtos);

	public void deleteInBulk(Long userId, String password) throws Exception;

	public void deleteInBulk(Long userId, int month, int year);

}
